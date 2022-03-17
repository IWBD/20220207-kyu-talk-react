import './styles.scss'
import _ from 'lodash'
import moment from 'moment'
import req2svr from './req2svr'

import { useState, useRef, useEffect, useCallback } from 'react'
import { usePopupManager } from '@context/popupManager'
import { useMemo } from 'react'
import { useStoreState, useStoreDispatch } from '@store'

import Icon from '@component/icon'

function ChattingRoom( props ) { 
  const [ message, setMessage ] = useState( '' )
  const scrollRef = useRef( null )
  const popupManager = usePopupManager()
  const store = useStoreState()
  const storeDispatch = useStoreDispatch()
  
  const closePopup = () => {
    popupManager.close( props.popupKey )
  }

  const onInputMessage = ( event ) => {
    setMessage( event.target.value )
  }

  const sendMessage = () => {
    const senMessage = {
      roomId: props.roomId || null,
      sendUserId: store.user.userId,
      text: message,
      createDate: new Date().getTime(),
    }

    req2svr.sendMessage( { 
      message: senMessage, 
      fromUserIdList: _.map( fromUserList, 'userId' ) 
    } ).then( res => {
      if( res.code !== 200 ) {
        console.error( 'message fail' )
        return 
      }
      
      const { chattingRoom: curChattingRoom, message } = res.payload 

      if( chattingRoom &&
        !_.isEmpty( _.differenceBy( chattingRoom.fromUserList, curChattingRoom.fromUserList, 'name' ) ) ) {
          storeDispatch( { type: 'updateChattingRoomList', values: { chattingRoomList: [ curChattingRoom ] } } )
      }

      storeDispatch( { type: 'updateMessageList', values: { messageList: [ message ] } } )

      moveScrollToBottom()
    } ).catch( err => {
      console.error( err )
    } ).finally( () => {
      setMessage( '' )
    } )
  }

  const moveScrollToBottom = () => {
    const { scrollHeight, clientHeight } = scrollRef.current
    scrollRef.current.scrollTop = scrollHeight - clientHeight
  }

  const userRelationMap = useMemo( () => {
    return _.keyBy( store.userRelationList, 'userId' )  
  }, [ store.userRelationList ] )

  const chattingRoom = useMemo( () => {
    return props.roomId ? _.find( store.chattingRoomList, { roomId: props.roomId } ) : null
  }, [ props.roomId, store.chattingRoomList ] )

  const fromUserList = useMemo( () => {
    const fromUserList = chattingRoom ? chattingRoom.roomUser : props.fromUserList
    return _( fromUserList )
      .filter( ( { userId } ) => {
        return store.user.userId !== userId 
      } )
      .map( fromUser => {
        return {
          ...fromUser,
          name: _.get( userRelationMap, `${fromUser.userId}.name` ) || fromUser.name 
        }
      } )
      .value()
  }, [ userRelationMap, store.user.userId, chattingRoom, props.fromUserList ] )

  const messageList = useMemo( () => {
    return _( store.messageList )
      .filter( message => {
        if( props.roomId ) {
          return message.roomId === props.roomId
        } 
        
        if( !props.roomId && message.roomId ) {
          return false
        }

        if( message.sendUserId === store.user.userId ) {
          return _.get( message, 'fromUserList.0.userId' ) === _.get( fromUserList, '0.userId' )
        }
        
        return _.get( message, 'fromUserList.0.userId' ) === store.user.userId
      } )
      .map( message => {
        let sendUserName
        if( message.sendUserId === store.user.userId ) {
          sendUserName = store.user.name
        } else {
          sendUserName = _.get( userRelationMap, `${message.sendUserId}.name` ) || message.sendUserName
        }

        const notReadCount = _.sumBy( message.fromUserList, ( { isRead } ) => isRead ? 0 : 1 )

        return { ...message, sendUserName, notReadCount }
      } )
      .orderBy( 'createDate' ).value()
  }, [ store.messageList, store.user.name, props.roomId, store.user.userId, fromUserList, userRelationMap ] )

  const renderList = useMemo( () => {
    return _.reduce( messageList, ( accumalator, message, idx ) => {
      if( !idx ) {
        accumalator.push( {
          sendUserId: message.sendUserId, 
          messageList: [ message ],
          sendUserName: message.sendUserName,
          formatDate: moment( message.createDate, 'x' ).format('LT')
        } )
        return accumalator
      } 
      
      const diffDate = moment( message.createDate, 'x' )
        .diff( moment( messageList[ idx - 1 ].createDate, 'x' ), 'minutes' )
      
      if( diffDate || messageList[ idx - 1 ].sendUserId !== message.sendUserId ) {
        accumalator.push( {
          sendUserId: message.sendUserId, 
          messageList: [ message ],
          sendUserName: message.sendUserName,
          formatDate: moment( message.createDate, 'x' ).format('LT')
        } )
        
        return accumalator
      } 

      accumalator[ accumalator.length - 1 ].formatDate = moment( message.createDate, 'x' ).format('LT')
      accumalator[ accumalator.length - 1 ].messageList.push( message )

      return accumalator
    }, [] )
  }, [ messageList ] )

  const title = useMemo( () => {
    if( fromUserList.length > 1 ) {
      return `그룹 채팅(${fromUserList.length})`
    } else {
      return _.get( fromUserList, `0.name` ) || '알수없음'
    }
  }, [ fromUserList ] )

  const readMessage = useCallback( async () => {
    const notReadMessageIdList = _.filter( messageList, ( { sendUserId, fromUserList } ) => {
      if( sendUserId === store.user.userId ) {
        return false
      }
      const fromUser = _.find( fromUserList, { userId: store.user.userId } )
      return !fromUser.isRead
    } )

    if( _.isEmpty( notReadMessageIdList ) ) {
      return
    }

    const params = {
      messageList: notReadMessageIdList,
      userId: store.user.userId
    }

    try {
      let res = await req2svr.readMessage( params )
      if( res.code !== 200 ) {
        throw new Error( res )    
      }
    } catch( err ) {
      console.error( err )
    }
  }, [ store.user.userId, messageList ] )
  
  useEffect( () => {
    readMessage()
    const { scrollHeight, clientHeight, scrollTop } = scrollRef.current
    if( scrollHeight - clientHeight - scrollTop < 150 ) {
      moveScrollToBottom()
    }
    // console.log( renderList )
  }, [ messageList, readMessage ] )

  useEffect( () => {
    moveScrollToBottom()
  }, [] )
 
  return (
    <div className="chatting-room-wrapper">
      <div className="header">
        <div className="button" onClick={closePopup}>
          <Icon>close</Icon>
        </div>
        { title }
        <div className="button"></div>
      </div>
      <div className="contents">
        <div className="chatting" ref={scrollRef}>
          { renderList && renderList.map( ( item, idx ) => {
            return <div className={`message-field ${item.sendUserId === store.user.userId ? 'my-message' : '' }`} key={idx}>
              { item.sendUserId !== store.user.userId && <div className="send-user-name">{item.sendUserName}</div> }
              { item.messageList.map( ( message, msgIdx ) => {
                return <div className="message-box" key={msgIdx}>
                  <div className="sub-info">
                    <div className="read-count">
                      { message.notReadCount || '' }
                    </div>
                    { item.messageList.length - 1 === msgIdx && <div className="send-date">{item.formatDate}</div> }
                  </div>
                  <div className="text">{message.text}</div>
                </div>
              } ) }
            </div>
          } ) } 
        </div>
        <div className="textarea-field">
          <textarea className="textarea"
                    value={message}
                    onInput={onInputMessage}></textarea>
          <div className="send-button"
                  onClick={sendMessage}>보내기</div>
        </div>
      </div>
    </div>
  )  
}

export default ChattingRoom
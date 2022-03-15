import styles from './styles.module.scss'
import _ from 'lodash'

import { useState, useRef, useEffect } from 'react'
import { usePopupManager } from '@context/popupManager'
import { useMemo } from 'react'
import { useStoreState, useStoreDispatch } from '@store'
import req2svr from './req2svr'
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
          sendUserName = _.get( userRelationMap, `${message.sendUserId}.name` )
        }
        return { ...message, sendUserName }
      } )
      .orderBy( 'createDate' ).value()
  }, [ store.messageList, store.user.name, props.roomId, store.user.userId, fromUserList, userRelationMap ] )

  const title = useMemo( () => {
    if( fromUserList.length > 1 ) {
      return `그룹 채팅(${fromUserList.length})`
    } else {
      return _.get( fromUserList, `0.name` ) || '알수없음'
    }
  }, [ fromUserList ] )
  
  useEffect( () => {
    const { scrollHeight, clientHeight, scrollTop } = scrollRef.current
    if( scrollHeight - clientHeight - scrollTop < 150 ) {
      moveScrollToBottom()
    }
  }, [messageList] )

  useEffect( () => {
    moveScrollToBottom()
  }, [] )
 
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.button} onClick={() => closePopup()}>
          <Icon>close</Icon>
        </div>
        { title }
        <div className={styles.button}></div>
      </div>
      <div className={styles.contents}>
        <div className={styles.chatting} ref={scrollRef}>
          { messageList && messageList.map( message => {
            return message.sendUserId === store.user.userId ?
              <div className={`${styles.message_field} ${styles.my_message}`} key={message.messageId}>
                <div className={styles.text}>{message.messageId}</div>
              </div> : 
              <div className={styles.message_field} key={message.messageId}>
                <div className={styles.name}>{message.sendUserName}</div>
                <div className={styles.text}>{message.messageId}</div>
              </div> 
          } ) }
        </div>
        <div className={styles.textarea_field}>
          <textarea className={styles.textarea}
                    value={message}
                    onInput={onInputMessage}></textarea>
          <div className={styles.send_button}
                  onClick={sendMessage}>보내기</div>
        </div>
      </div>
    </div>
  )  
}

export default ChattingRoom
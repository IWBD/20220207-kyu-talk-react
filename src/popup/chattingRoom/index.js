import styles from './styles.module.scss'
import _ from 'lodash'

import { useState, useRef, useEffect } from 'react'
import { usePopupManager } from '@context/popupManager'
import { useMemo } from 'react'
import { useStoreState, useStoreDispatch } from '@store'
import req2svr from './req2svr'

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
    const sendMessge = {
      roomId: props.roomId || null,
      sendUserId: store.user.userId,
      text: message,
      createDate: new Date().getTime(),
      notReadCount: fromUserList.length,
    }
     
    req2svr.sendMessage( { 
      message: sendMessge, 
      fromUserIdList: fromUserList || null
    } ).then( res => {
      if( res.code !== 200 ) {
        console.error( 'message fail' )
        return 
      }
      
      const { chattingRoom, message, userRelationList } = res.payload 

      if( userRelationList && !_.isEmpty( userRelationList ) ) {
        storeDispatch( { type: 'updateUserRelationList', values: { messageList: userRelationList } } )
      }

      if( chattingRoom && !_.isEmpty( chattingRoom ) ) {
        storeDispatch( { type: 'updateChattingRoomList', values: { messageList: [ chattingRoom ] } } )
      }

      storeDispatch( { type: 'updateMessageList', values: { messageList: [ message ] } } )

      moveScrollToBottom()
    } ).catch( err => {
      console.error( err )
    } ).finally( () => {
      setMessage( '' )
    } )
  }

  const userRelationMap = useMemo( () => {
    return _.keyBy( store.userRelationList, 'userId' )  
  }, [ store.userRelationList ] )

  const moveScrollToBottom = () => {
    const { scrollHeight, clientHeight } = scrollRef.current
    scrollRef.current.scrollTop = scrollHeight - clientHeight
  }

  // const messageList = useMemo( () => {
  //   // return _.get( store.messageListWithChattingRoom, `${props.roomKey}.messageList` ) || []
  //   return
  // }, [store.messageListWithChattingRoom, props.roomKey] )

  const chattingRoom = useMemo( () => {
    return props.roomId ? _.find( store.chattingRoomList, { roomId: props.roomId } ) : null
  }, [ props.roomId, store.chattingRoomList ] )

  const fromUserList = useMemo( () => {
    let fromUserList
    if( chattingRoom ) {
      try {
        fromUserList = JSON.parse( chattingRoom.fromUserList )
      } catch( err ) {
        console.error( err )
        return null
      }
    } else {
      fromUserList = props.fromUserList
    }

    return fromUserList
  }, [chattingRoom, props.fromUserList] )

  const messageList = useMemo( () => {
    console.log( store.messageList )
    return _( store.messageList )
      .filter( message => {
        if( message.roomId ) {
          return message.roomId === ( props.roomId || null )
        } 

        if( message.sendUserId === store.user.userId ) {
          return message.fromUserId === fromUserList[0]
        }
        
        return message.fromUserId === store.user.userId
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
  }, [store.messageList, store.user.name, props.roomId, store.user.userId, fromUserList, userRelationMap] )

  

  // const chattingRoom = useMemo( () => {
  //   // const test = _.get( store.messageListWithChattingRoom, props.roomKey ) || 

  //   // if( chattingRoom ) {
  //   //   return chattingRoom
  //   // }

  //   // const firstMessage = _.minBy( messageList, 'createDate' )
  //   // let fromUserList
  //   // if( firstMessage ) {
  //   //   if( firstMessage.sendUserId === store.user.userId ) {
  //   //     fromUserList = [ {
  //   //       fromUserId: firstMessage.fromUserId,
  //   //       fromUserName: _.get( userRelationMap, `${firstMessage.fromUserId}.name` )
  //   //     } ]
  //   //   } else {
  //   //     fromUserList = [ {
  //   //       fromUserId: firstMessage.sendUserId,
  //   //       fromUserName: _.get( userRelationMap, `${firstMessage.sendUserId}.name` )
  //   //     } ]
  //   //   }
  //   // } else {
  //   // let fromUserList = props.fromUserList
  //   // }

  //   return {
  //     fromUserList,
  //     roomId: null,
  //     createDate: _.get( firstMessage, 'createDate' ) || null
  //   }
  // }, [store.messageListWithChattingRoom, props.fromUserList, userRelationMap, props.roomKey] )

  const title = useMemo( () => {
    if( chattingRoom ) {
      return `그룹 채팅(${fromUserList.length})`
    } else {
      return _.get( userRelationMap, `${fromUserList[0]}.name` ) || '알수없음'
    }
  }, [chattingRoom, fromUserList, userRelationMap] )
  
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
        <button className={styles.button} onClick={() => closePopup()}>닫기</button>
        { title }
        <button className={styles.button} onClick={() => closePopup()}>닫기</button>
      </div>
      <div className={styles.contents}>
        <div className={styles.chatting} ref={scrollRef}>
          { messageList && messageList.map( message => {
            return message.sendUserId === store.user.userId ?
              <div className={`${styles.message_field} ${styles.my_message}`} key={message.messageId}>
                <div className={styles.text}>{message.text}</div>
              </div> : 
              <div className={styles.message_field} key={message.messageId}>
                <div className={styles.name}>{message.name}</div>
                <div className={styles.text}>{message.text}</div>
              </div> 
          } ) }
        </div>
        <div className={styles.textarea_field}>
          <textarea className={styles.textarea}
                    value={message}
                    onInput={( event ) => onInputMessage( event )}></textarea>
          <button className={styles.send_button}
                  onClick={() => sendMessage()}>보내기</button>
        </div>
      </div>
    </div>
  )  
}

export default ChattingRoom
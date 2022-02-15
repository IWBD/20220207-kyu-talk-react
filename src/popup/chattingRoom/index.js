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
    const fromUserIdList = _.map( props.userList, 'userId' )
    const sendMessge = {
      roomId: props.roomId,
      sendUserId: store.user.userId,
      name: store.user.name,
      text: message,
      createDate: new Date().getTime(),
      notReadCount: fromUserIdList.length,
    }

    if( !sendMessge.roomId ) {
      sendMessge.userId = _.get( props.userList, '0.userId' )
    }

    req2svr.sendMessage( { 
      message: sendMessge, fromUserIdList 
    } ).then( res => {
      if( res.code !== 200 ) {
        console.error( 'message fail' )
        return 
      }
      sendMessge.messageId = res.payload
      storeDispatch( { type: 'changeMessageList', values: { message: sendMessge, chattingRoom: chattingRoom } } )
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

  const chattingRoom = useMemo( () => {
    if( props.roomId ) {
      return {}
    } 
    return _.find( store.chattingRoomList, { roomId: props.roomId } ) || {}
  }, [props.roomId, store.chattingRoomList] )

  const messageList = useMemo( () => {
    return _( store.messageList )
      .filter( message => {
        return message.roomId === props.roomId &&
          ( _.find( props.userList, { userId: message.sendUserId } ) || 
            _.find( props.userList, { userId: message.userId } ) )
      } )
      .orderBy( 'createDate' )
      .value()
  }, [store, props.roomId, props.userList] )

  const title = useMemo( () => {
    return props.userList.length > 1 ? `그룹 채팅(${props.userList.length})`
      : props.userList[0].name
  }, [props.userList] )
  
  const user = useMemo( () => {
    return store.user
  }, [store.user] ) 

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
            return message.sendUserId === user.userId ?
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
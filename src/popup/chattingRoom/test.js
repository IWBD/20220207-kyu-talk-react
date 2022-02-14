import styles from './styles.module.scss'
import _ from 'lodash'

import { useState, useRef, useEffect } from 'react'
import { usePopupManager } from '@context/popupManager'
import { useMemo } from 'react'
import { useStoreState, useStoreDispatch } from '@store'
import req2svr from './req2svr'

// let messageKey = 0

function ChattingRoom( props ) { 
  const [ message, setMessage ] = useState( '' )
  const [ scrollTop, setScrollTop ] = useState(0)
  const scrollRef = useRef( null )
  const popupManager = usePopupManager()
  const store = useStoreState()
  const storeDispatch = useStoreDispatch()
  // const [ sendMessageList, setSendMessageList ] = useState( [] )
  
  const closePopup = () => {
    popupManager.close( props.popupKey )
  }

  const onInputMessage = ( event ) => {
    setMessage( event.target.value )
  }

  const sendMessage = () => {
    // const msgKey = messageKey++
    const fromUserIdList = _.map( props.userList, 'userId' )
    const sendMessge = {
      roomId: props.roomId,
      sendUserId: store.user.userId,
      name: store.user.name,
      text: message,
      createDate: new Date().getTime(),
      notReadCount: fromUserIdList.length,
      // msgKey
    }

    // setSendMessageList( [ ...sendMessageList, message ] )

    req2svr.sendMessage( { 
      message: sendMessge, fromUserIdList 
    } ).then( res => {
      if( res.code !== 200 ) {
        console.log( 'message fail' )
        return 
      }
      sendMessge.messageId = res.payload
      storeDispatch( { type: 'changeMessageList', values: { message: sendMessge } } )
      moveScrollToBottom()
    } ).catch( err => {
      console.error( err )
    } ).finally( () => {
      setMessage( '' )
    } )
    // socket.sendMessage( messageParams )
  }

  // useEffect( () => {
  //   setSendMessageList( _.filter( sendMessageList, ( { msgKey } ) => {
  //     return _.find( store.messageLis, { msgKey } )
  //   } ) )
  // }, [store.messageLis, sendMessageList] )

  const messageList = useMemo( () => {
    return _( store.messageList )
      .filter( message => {
        return message.roomId === props.roomId &&
          ( _.find( props.userList, { userId: message.sendUserId } ) ||
            message.sendUserId === store.user.userId )
      } )
      // .concat( sendMessageList )
      .orderBy( 'createDate' )
      .value()
  }, [store, props.roomId, props.userList] )

  const title = useMemo( () => {
    return '채팅방 이름'
  }, [] )
  
  const user = useMemo( () => {
    return store.user
  }, [store.user] ) 

  useEffect( () => {
    if( scrollTop < 150 ) {
      moveScrollToBottom()
    }
  }, [messageList] )

  const moveScrollToBottom = () => {
    const { scrollHeight, clientHeight } = scrollRef.current
    scrollRef.current.scrollTop = scrollHeight - clientHeight
    setScrollTop( scrollRef.current.scrollTop )
  }

  const onScroll = () => {
    setScrollTop( scrollRef.current.scrollTop )
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <button onClick={() => closePopup()}>닫기</button>
        { title }
      </div>
      <div className={styles.contents}>
        <div className={styles.chatting} ref={scrollRef} onScroll={() => onScroll()}>
          { messageList && messageList.map( message => {
            return message.sendUserId === user.userId ?
              <div className={styles.my_messge_field} key={message.messageId}>
                <div className={styles.text}>{message.text}</div>
              </div> : 
              <div className={styles.messge_field} key={message.messageId}>
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
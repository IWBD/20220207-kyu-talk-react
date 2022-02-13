import styles from './styles.module.scss'
import _ from 'lodash'

import { useState } from 'react'
import { usePopupManager } from '@context/popupManager'
import { useMemo } from 'react'
import { useStoreState } from '@store'
import { useSocket } from '@context/socket'

function ChattingRoom( props ) { 
  const popupManager = usePopupManager()
  const store = useStoreState()
  const socket = useSocket()
  
  const [ message, setMessage ] = useState( '' )

  const closePopup = () => {
    popupManager.close( props.popupKey )
  }

  const onInputMessage = ( event ) => {
    setMessage( event.target.value )
  }

  const sendMessage = () => {
    const messageParams = {
      message: {
        roomId: props.roomId,
        sendUserId: store.user.userId,
        text: message,
        createDate: new Date().getTime()
      },
      fromUserIdList: _.map( props.userList, 'userId' ),
    }
    socket.sendMessage( messageParams )
    setMessage('')
  }

  const messageList = useMemo( () => {
    return _( store.messageList )
      .filter( message => {
        return message.roomId === props.roomId 
          && ( _.find( props.userList, { userId: message.sendUserId } )
            || message.sendUserId === store.user.userId )
      } ).orderBy( 'createDate' ).value()
  }, [store, props.roomId, props.userList] )

  const title = useMemo( () => {
    return '채팅방 이름'
  }, [] )
  
  const user = useMemo( () => {
    return store.user
  }, [store.user] ) 

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <button onClick={() => closePopup()}>닫기</button>
        { title }
      </div>
      <div className={styles.contents}>
        <div className={styles.chatting}>{ messageList.length }
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
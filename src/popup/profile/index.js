import styles from './styles.module.scss'
import { usePopupManager } from '@context/popupManager'
import ChattingRoom from '@popup/chattingRoom'

function Profile( props ) {
  const popupManager = usePopupManager() 

  const onOpenChatting = async () => {
    const params = {
      userList: [ {
        userId: props.userId,
        name: props.name,
      } ],
      roomId: null 
    } 

    popupManager.open( ChattingRoom, params )
  }
  
  const closePopup = () => {
    popupManager.close( props.popupKey )
  }
  
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <button onClick={() => closePopup()}>닫기</button>
      </div>
      <div className={styles.body}>
        {props.name }
      </div>
      <div className={styles.footer}>
        <button onClick={() => onOpenChatting()}>1대1 채팅</button>
      </div>
    </div> 
  )
}


export default Profile
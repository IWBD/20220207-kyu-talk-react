import _ from 'lodash'
import styles from './styles.module.scss'
import { useMemo } from 'react'
import { useStoreState, useStoreDispatch } from '@store'
import { usePopupManager } from '@context/popupManager'
import ChattingRoom from '@popup/chattingRoom'
import req2svr from './req2svr'

function Profile( props ) {
  const store = useStoreState()
  const storeDispatch = useStoreDispatch()
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

  const addFriend = () => {
    req2svr.addFriend( store.user.userId, props.userId ).then( res => {
      if( res.code !== 200 ) {
        throw new Error( res )
      }
      storeDispatch( { type: 'changeFriendList', values: { friendList: res.payload } } )
    } ).catch( err => {
      console.error( err )
      alert( '친구 추가에 실패하였습니다.' )
    })
  }

  const isFriend = useMemo( () => {
    return !!_.find( store.friendList, { userId: props.userId } )
  }, [props.userId, store.friendList] )
  
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
        { !isFriend && <button onClick={() => addFriend()}>친구 추가</button> }
      </div>
    </div> 
  )
}


export default Profile
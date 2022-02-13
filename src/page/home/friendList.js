import styles from './styles.module.scss'
import { useStoreState } from '@store'
import { usePopupManager } from '@context/popupManager'
import Profile from '@popup/profile'

function FriendList() {
  const store = useStoreState()
  const popupManager = usePopupManager()
  
  const openProfill = async ( user ) => {
    popupManager.open( Profile, user )
  }

  return (
    <>
      <div className={styles.user}>
        {store.user.name}{store.user.userId}
      </div>
      <div className={styles.friend_area}>
        <div className={styles.friend_summery}>친구 {store.friendList.length}</div> 
        { store.friendList.map( friend => {
          return <div className={styles.friend} key={friend.userId} onClick={() => openProfill(friend)}>
            {friend.name}
          </div>
        } ) }
      </div> 
    </>
  )
}

export default FriendList
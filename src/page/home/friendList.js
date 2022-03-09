import styles from './styles.module.scss'
import { useMemo } from 'react'
import { useStoreState } from '@store'
import { usePopupManager } from '@context/popupManager'
import Profile from '@popup/profile'
import _ from 'lodash'

function FriendList() {
  const store = useStoreState()
  const popupManager = usePopupManager()
  
  const openProfill = async ( user ) => {
    popupManager.open( Profile, user )
  }

  const friendList = useMemo( () => {
    return _( store.userRelationList )
      .filter( userRelation => userRelation.isFriend && !userRelation.isBlock )
      .orderBy( 'name' ).value()
  }, [ store.userRelationList ] )  

  return (
    <>
      <div className={styles.user}>
        {store.user.name}{store.user.userId}
      </div>
      <div className={styles.friend_area}>
        <div className={styles.friend_summery}>친구 {friendList.length}</div> 
        { friendList.map( friend => {
          return <div className={styles.friend} key={friend.userId} onClick={() => openProfill(friend)}>
            {friend.name}
          </div>
        } ) }
      </div> 
    </>
  )
}

export default FriendList
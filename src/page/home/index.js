import styles from './styles.module.scss'
import { useState, useMemo } from 'react'

import Icon from '@component/icon'

import ChattingList from './chattingList'
import FriendList from './friendList'

import AddFriend from '@popup/addFriend'
import AddChattingRoom from '@popup/addChattingRoom'
import SearchUser from '@popup/searchUser'
import { usePopupManager } from '@context/popupManager'

function Home() {
  const [ tabs, setTabs ] = useState( 'friend' )
  const popupManager = usePopupManager()
 
  const onChangeTabs = ( tabs ) => {
    setTabs( tabs )
  }
  
  const openSearchUser = () => {
    popupManager.open( SearchUser )
  }

  const openAddFriend = () => {
    popupManager.open( AddFriend )
  }

  const openMakeChatting = () => {
    popupManager.open( AddChattingRoom )
  }

  const headerTitle = useMemo( () => {
    return tabs === 'friend' ? '친구' : '채팅'
  }, [tabs] )

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.title}>{headerTitle}</div>
        <div className={styles.contents}>
          <div className={styles.button} onClick={() => openSearchUser()}>
            <Icon>search</Icon>
          </div>
          { tabs === 'friend' ? 
            <div className={styles.button} onClick={() => openAddFriend()}>
              <Icon>person_add</Icon>
            </div> :
            <div className={styles.button} onClick={() => openMakeChatting()}>
              <Icon>maps_ugc</Icon>
            </div> }
        </div>
      </div> 
      <div className={styles.body}>
        { tabs === 'friend' ? 
          <FriendList></FriendList> :
          <ChattingList></ChattingList> }
      </div>
      <div className={styles.footer}>
        <div className={styles.button} onClick={() => onChangeTabs( 'friend' )}>
          <Icon option={tabs === 'friend' ? '' : 'outlined'} fontSize={'30px'}>person</Icon>
        </div>
        <div className={styles.button} onClick={() => onChangeTabs( 'chatting' )}>
          <Icon option={tabs === 'chatting' ? '' : 'outlined'} fontSize={'30px'}>textsms</Icon>
        </div>
      </div>
    </div>
  )
}

export default Home
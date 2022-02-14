import styles from './styles.module.scss'
import { useState, useMemo } from 'react'

import ChattingList from './chattingList'
import FriendList from './friendList'

import SearchUser from '@popup/searchUser'
import { usePopupManager } from '@context/popupManager'

function Home() {
  const [ tabs, setTabs ] = useState( 'friend' )
  const popupManager = usePopupManager()
 
  const onChangeTabs = ( tabs ) => {
    setTabs( tabs )
  }

  const openSeatchUser = () => {
    popupManager.open( SearchUser )
  }

  const headerTitle = useMemo( () => {
    return tabs === 'friend' ? '친구' : '채팅'
  }, [tabs] )

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.title}>{headerTitle}</div>
        <div className={styles.contents}>
          <button onClick={() => openSeatchUser()}>검색</button>
        </div>
      </div> 
      <div className={styles.body}>
        { tabs === 'friend' ? 
          <FriendList></FriendList> :
          <ChattingList></ChattingList>}
      </div>
      <div className={styles.footer}>
        <button className={styles.button} onClick={() => onChangeTabs('friend')}>친구</button>
        <button className={styles.button} onClick={() => onChangeTabs('chatting')}>채팅</button>
      </div>
    </div>
  )
}

export default Home
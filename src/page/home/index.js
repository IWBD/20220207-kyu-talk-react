import styles from './styles.module.scss'
// import { useState, useMemo } from 'react'

// import { useStoreState } from '@store'
import FriendList from './friendList'

function Home() {
  // const store = useStoreState()

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.title}>안녕</div>
        <div className={styles.contents}>
          <button>검색</button>
          <button>추가</button>
        </div>
      </div> 
      <div className={styles.body}>
        <FriendList></FriendList>
      </div>
      <div className={styles.footer}>
        여기가 풋터
      </div>
    </div>
  )
}

export default Home
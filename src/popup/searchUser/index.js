import styles from './styles.module.scss'
import _ from 'lodash'
import req2svr from './req2svr'
import { useState } from 'react'
import { usePopupManager } from '@context/popupManager'
import { useStoreState } from '@store'
import Profile from '@popup/profile'
 
function SearchUser( props ) {
  const [ searchWord, setSearchWord ] = useState( '' )
  const [ userList, setUserList ] = useState( [] )
  const popupManager = usePopupManager()
  const store = useStoreState()
  
  const onInputSearchWord = ( event ) => {
    setSearchWord( event.target.value )
  }

  const onSearchUser = () => {
    req2svr.searchUser( store.user.userId, searchWord ).then( res => {
      if( res.code !== 200 ) {
        throw new Error( res )
      }
      setUserList( res.payload )
    } ).catch( err => {
      console.error( err )
      alert( '검색에 실패하였습니다.' )
    } )
  }

  const onOpenProfile = ( user ) => {
    popupManager.open( Profile, user )
  }

  const closePopup = () => {
    popupManager.close( props.popupKey )
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <button className={styles.button} onClick={() => closePopup()}>닫기</button>
        <input value={searchWord} onInput={( event ) => onInputSearchWord( event )}></input>
        <button className={styles.button} onClick={() => onSearchUser()}>검색</button>
      </div>
      <div className={styles.body}>
        { userList.length < 1 ? <div className={styles.user_empty}>
          검색된 사용자가 없습니다.
        </div> : <div className={styles.user_list}>
            { userList.map( user => {
              return <div onClick={() => onOpenProfile( user )} className={styles.user} key={user.userId}>{user.name}</div>
            } ) }
        </div> }
      </div> 
    </div>
  )
}

export default SearchUser
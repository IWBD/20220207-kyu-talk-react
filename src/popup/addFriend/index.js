import styles from './styles.module.scss'
import req2svr from './req2svr'
import { useState } from 'react'
import { usePopupManager } from '@context/popupManager'
import { useStoreState } from '@store'
import Profile from '@popup/profile'
import Icon from '@component/icon'
 
function AddFriend( props ) {
  const [ searchWord, setSearchWord ] = useState( '' )
  const [ userList, setUserList ] = useState( [] )
  const popupManager = usePopupManager()
  const store = useStoreState()
  
  const onInputSearchWord = ( event ) => {
    setSearchWord( event.target.value )
  }

  const onSearchUser = () => {
    if( !searchWord ) {
      return 
    }
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

  const onKeyPressEnter = ( event ) => {
    if( event.key === 'Enter' ) {
      onSearchUser()
    }
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
        <div className={styles.button} onClick={() => closePopup()}>
          <Icon>close</Icon>
        </div>
        <input value={searchWord} onInput={( event ) => onInputSearchWord( event )}
               onKeyPress={ event => onKeyPressEnter( event ) }></input>
        <div className={styles.button} onClick={() => onSearchUser()}>
          <Icon>search</Icon>
        </div>
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

export default AddFriend
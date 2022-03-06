import styles from './styles.module.scss'
import _ from 'lodash'
import { useState, useMemo } from 'react'
import { usePopupManager } from '@context/popupManager'
import { useStoreState } from '@store'
import Profile from '@popup/profile'
 
function SearchUser( props ) {
  const [ searchWord, setSearchWord ] = useState( '' )
  // const [ userList, setUserList ] = useState( [] )
  const popupManager = usePopupManager()
  const store = useStoreState()
  
  const onInputSearchWord = ( event ) => {
    setSearchWord( event.target.value )
  }

  const filteredFreind = useMemo( () => {
    if( !searchWord ) {
      return store.friendList
    } else {
      return _.filter( store.friendList, friend => {
        return _.includes( friend.name, searchWord ) || _.includes( friend.userId, searchWord )
      } )
    }
  }, [store.friendList, searchWord] )

  const onOpenProfile = ( user ) => {
    popupManager.open( Profile, user )
  }

  const closePopup = () => {
    popupManager.close( props.popupKey )
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <button className={styles.button} onClick={() => closePopup()}>취소</button>
        <input value={searchWord} onInput={( event ) => onInputSearchWord( event )}></input>
      </div>
      <div className={styles.body}>
        { filteredFreind.length < 1 ? <div className={styles.user_empty}>
          검색된 사용자가 없습니다.
        </div> : <div className={styles.user_list}>
            { filteredFreind.map( user => {
              return <div onClick={() => onOpenProfile( user )} className={styles.user} key={user.userId}>{user.name}</div>
            } ) }
        </div> }
      </div> 
    </div>
  )
}

export default SearchUser
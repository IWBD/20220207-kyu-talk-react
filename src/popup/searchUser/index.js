import styles from './styles.module.scss'
import _ from 'lodash'
import { useState, useMemo } from 'react'
import { usePopupManager } from '@context/popupManager'
import { useStoreState } from '@store'
import Profile from '@popup/profile'
import TextField from '@component/textField'
import Icon from '@component/icon'
 
function SearchUser( props ) {
  const [ searchWord, setSearchWord ] = useState( '' )
  // const [ userList, setUserList ] = useState( [] )
  const popupManager = usePopupManager()
  const store = useStoreState()
  
  const onInputSearchWord = ( value ) => {
    setSearchWord( value )
  }

  const filteredFreind = useMemo( () => {
    return _.filter( store.userRelationList, userRelation => {
      if( !userRelation.isFriend ) {
        return false
      }

      if( !searchWord ) {
        return true
      }

      return _.includes( userRelation.name, searchWord ) || _.includes( userRelation.userId, searchWord )
    } )
  }, [store.userRelationList, searchWord] )

  const onOpenProfile = ( user ) => {
    popupManager.open( Profile, user )
  }

  const closePopup = () => {
    popupManager.close( props.popupKey )
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.button} onClick={closePopup}>
          <Icon>close</Icon>
        </div>
        <TextField value={searchWord}
                   placeholder="아이디 혹은 이름 입력"
                   onChange={onInputSearchWord}></TextField>
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
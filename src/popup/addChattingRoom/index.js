import './styles.scoped.scss'
import _ from 'lodash'
import req2svr from './req2svr'

import { useState, useMemo } from 'react'
import { useStoreState } from '@store'
import { usePopupManager } from '@context/popupManager' 

import CustomCheckBox from '@component/customCheckBox'
import Icon from '@component/icon'
import TextFiled from '@component/textField'

function AddChattingRoom( props ) {
  const popupManager = usePopupManager()
  const [ searchWord, setSearchWord ] = useState( '' )
  const [ selectedFriend, setSelectedFriend ] = useState( [] )

  const store = useStoreState()

  const closePopup = ( param ) => {
    popupManager.close( props.popupKey, param )
  }

  const onChangeSearchWord = ( value ) => {
    setSearchWord( value )
  }

  const onChangeSelectedFriend = ( value ) => {
    setSelectedFriend( value )
  }

  const filteredFriendList = useMemo( () => {
    const trimSearchWord = searchWord.trim() 
    return _.filter( store.userRelationList, userRelation => {
      if( !userRelation.isFriend ) {
        return false
      }
      if( !trimSearchWord ) {
        return true
      }
      return userRelation.isFriend && 
        ( _.includes( userRelation.name, trimSearchWord ) || _.includes( userRelation.userId, trimSearchWord ) )
    } )
  }, [store.userRelationList, searchWord] )

  const onAddChattingRoom = async () => {
    const createUserId = _.get( store, 'user.userId' )
    const roomUser = [ ...selectedFriend, createUserId ]

    try {
      let res = await req2svr.addChattingRoom( createUserId, roomUser )
      if( res.code !== 200 ) {
        throw new Error( res )
      }    
      
      const chattingRoom = res.payload
      closePopup( chattingRoom )
    } catch( err ) {
      console.error( err )
      alert( '채팅룸 만들기를 실패했습니다.' )
    }
  }

  return (
    <div className="add-chatting-room-wrapper">
      <div className="header">
        <div className="close-btn" onClick={() => closePopup()}>
          <Icon>close</Icon>
        </div>
        <span className="title">대화상대 초대</span>
        <div className="complate-btn" onClick={onAddChattingRoom}>확인</div>
      </div>
      <div className="search-field">
        <TextFiled onChange={onChangeSearchWord} 
                  value={searchWord}
                  placeholder="이름, 혹은 아이디 입력"></TextFiled>
      </div>
      <div className="body">
        { filteredFriendList && filteredFriendList.map( friend => {
          return <div className="friend-area" key={friend.userId}>
            <div className="friend-name">{friend.name}</div>
            <CustomCheckBox value={selectedFriend}
                            iconStyle={{color: 'rgb(253, 246, 17)'}}
                            onChange={onChangeSelectedFriend}
                            trueValue={friend.userId}></CustomCheckBox>
          </div>
        } ) }
      </div>
    </div>
  )  
}


export default AddChattingRoom
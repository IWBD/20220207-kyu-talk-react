import './styles.scss'
import _ from 'lodash'
import { useMemo } from 'react'
import { useStoreState, useStoreDispatch } from '@store'
import { usePopupManager } from '@context/popupManager'
import ChattingRoom from '@popup/chattingRoom'
import req2svr from './req2svr'

import Icon from '@component/icon'

function Profile( props ) {
  const store = useStoreState()
  const storeDispatch = useStoreDispatch()
  const popupManager = usePopupManager() 

  const onOpenChatting = async () => {
    const params = {
      fromUserList: [ props.userId ],
      roomKey: `user_${props.userId}` 
    } 

    popupManager.open( ChattingRoom, params )
  }
  
  const closePopup = () => {
    popupManager.close( props.popupKey )
  }

  const onAddFriend = () => {
    req2svr.addFriend( store.user.userId, props.userId ).then( res => {
      if( res.code !== 200 ) {
        throw new Error( res )
      }
      storeDispatch( { type: 'updateUserRelationList', values: { userRelationList: [ res.payload ] } } )
    } ).catch( err => {
      console.error( err )
      alert( '친구 추가에 실패하였습니다.' )
    })
  }

  const isFriend = useMemo( () => {
    const userRelation = _.find( store.userRelationList, { userId: props.userId } )
    return userRelation && userRelation.isFriend
  }, [props.userId, store.userRelationList] )
  
  return (
    <div className="profile-wrapper">
      <div className="header">
        <div onClick={closePopup}>
          <Icon>close</Icon>
        </div> 
      </div>
      <div className="body">
        {props.name}
      </div>
      <div className="footer">
        <div className="footer-button" onClick={onOpenChatting}>
          <Icon>textsms</Icon>
          1대1 채팅
        </div>
        { !isFriend && <div className="footer-button" onClick={onAddFriend}>
          <Icon>person_add</Icon>
          친구 추가
        </div> }
      </div>
    </div> 
  )
}


export default Profile
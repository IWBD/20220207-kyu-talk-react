import styles from './styles.module.scss'
import _ from 'lodash'
import { useMemo, useEffect } from 'react'
import { useStoreState } from '@store'
import moment from 'moment'
import { usePopupManager } from '@context/popupManager' 
import ChattingRoom from '@popup/chattingRoom'
// const params = {
//   userList: [ {
//     userId: props.userId,
//     name: props.name,
//   } ],
//   chattingRoom: null,
//   maxSendDate,
// } 
function ChattingList() {
  const store = useStoreState()
  const popupManager = usePopupManager()

  const renderList = useMemo( () => {
    return _( store.messageListWithChattingRoom )
      .map( ( { chattingRoom, messageList }, key ) => {
        const recentlyMessage = _.maxBy( messageList, 'createDate' )

        const date = _.get( recentlyMessage, 'createDate' ) || _.get( chattingRoom, 'createDate' )
        const formatDate = moment( date, 'x' ).format( 'MM월 DD일' )

        let text = _.get( recentlyMessage, 'text' ) || '' 
        
        let userStr
        if( chattingRoom ) {
          userStr = chattingRoom.userList
        } else if( recentlyMessage.sendUserId === store.user.userId ) {
          userStr = recentlyMessage.fromUserName
        } else {
          userStr = recentlyMessage.sendUserName
        }
        
        return {
          date, formatDate, text, userStr, key
        }
      } ).orderBy( 'date', 'desc' ).value()
  }, [store.messageListWithChattingRoom] )

  const openChattingRoom = ( roomKey ) => {
    popupManager.open( ChattingRoom, { roomKey } )
  } 
   
  return (
    <>
      { renderList && renderList.map( item => {
        return <div className={styles.room_area} key={item.key} onClick={() => openChattingRoom( item.key )}>
          <div className={styles.contents}>
            <div className={styles.room_title}>
              <div className={styles.text_gard}>
                {item.userStr}
              </div>
            </div>
            <div className={styles.text}>
              <div className={styles.text_gard}>
                {item.text}
              </div>
            </div>
          </div>
          <div className={styles.date}>
            {item.formatDate}
          </div>
        </div>
      } ) }
    </>
  )
}

export default ChattingList
import styles from './styles.module.scss'
import _ from 'lodash'
import { useMemo, useEffect } from 'react'
import { useStoreState } from '@store'
import moment from 'moment'
import { usePopupManager } from '@context/popupManager' 
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
  
  const processedRoomList = useMemo( () => {
    
    let [ roomMessageList, noneRoomMessageList ] = _.partition( store.messageList, 'roomId' )
    roomMessageList = _( roomMessageList )
      .groupBy( 'roomId' )
      .map( ( messageList, roomId ) => {
        const chattingRoom = _.find( store.chattingRoomList, { roomId } )
        let userList = []
        if( chattingRoom ) {
          try {
            userList = JSON.parse( chattingRoom.roomUser )
          } catch( err ) {
            console.error( err )
          }
        }
        
        const message = _.maxBy( messageList, 'createDate' )
        const formatDate = moment( message.createDate, 'x' ).format( 'MM월 DD일' )
        const userListStr = _( userList ).map( 'name' ).join( ' ,' )
        
        const notReadCount = _.sumBy( messageList, 'notReadCount' ) 
        const isNotReadCount = _.sumBy( messageList, ( { isRead } ) => _.isNull( isRead ) ? 1 : 0 )
        
        return {
          ...message,
          formatDate,
          userList,
          userListStr,
          notReadCount: notReadCount + isNotReadCount
        }
      } ).value()
    console.log( store.chattingRoomList )
    let chattingRoomList = _( store.chattingRoomList )
      .filter( ( { roomId } ) => !_.find( roomMessageList, { roomId } ) )
      .map( room => {
        let userList = []
        try {
          userList = JSON.parse( room.roomUser )
        } catch( err ) {
          console.error( err )
        }

        const userListStr = _( userList ).map( 'name' ).join( ' ,' )
        const formatDate = moment( room.createDate, 'x' ).format( 'MM월 DD일' )

        return {
          ...room,
          userList,
          userListStr,
          formatDate
        }
      } ).value()

    console.log( chattingRoomList )
    
    let [ mySendMessageList, anotherMessageList ] = _.partition( noneRoomMessageList, ( { sendUserId } ) => {
      return sendUserId === store.user.userId
    } )

    anotherMessageList = _( anotherMessageList )
      .groupBy( 'sendUserId' )
      .map( ( messageList, sendUserId ) => {
        const fistMessage = _.get( messageList, '0' )
        const userList = [{ name: fistMessage.name, userId: fistMessage.userId }]
        
        const messageListOfMe = _.filter( mySendMessageList, { userId: sendUserId } )
        messageList = _.concat( messageList, messageListOfMe )
        
        const message = _.maxBy( messageList, 'createDate' )
        const formatDate = moment( message.createDate, 'x' ).format( 'MM월 DD일' )
        const userListStr = _( userList ).map( 'name' ).join( ' ,' )

        const notReadCount = _.sumBy( messageList, 'notReadCount' ) 
        const isNotReadCount = _.sumBy( messageList, ( { isRead } ) => _.isNull( isRead ) ? 1 : 0 )
        
        return {
          ...message,
          formatDate,
          userList,
          userListStr,
          notReadCount: notReadCount + isNotReadCount
        }
      } ).value()

    return _( roomMessageList )
      .concat( anotherMessageList )
      .filter( chattingRoom => !_.isEmpty( chattingRoom ) )
      .orderBy( 'createDate', 'desc' ).value()
   
  }, [store.chattingRoomList, store.messageList, store.user.userId] )


  const openChattingRoom = () => {
    
  } 
   
  return (
    <>
      { processedRoomList && processedRoomList.map( ( room, idx ) => {
        return <div className={styles.room_area} key={idx}>
          <div className={styles.contents}>
            <div className={styles.room_title}>
              <div className={styles.text_gard}>
                {room.userListStr}
              </div>
            </div>
            <div className={styles.text}>
              <div className={styles.text_gard}>
                {room.text}
              </div>
            </div>
          </div>
          <div className={styles.date}>
            {room.formatDate}
          </div>
        </div>
      } ) }
    </>
  )
}

export default ChattingList
import { createContext, useContext, useReducer } from 'react'
import _ from 'lodash'

const initialState = {
  user: {
    userId: null,
    name: null,
  },
  friendList: [],
  chattingRoomList: [],
  messageList: [],
  messageListWithChattingRoom: []
}

const storeContext = createContext( {} )
const storeDispatchContext = createContext()

function reducer( state, action ) {
  switch( action.type ) {
    case 'initStore':
      state.user = action.values.user
      state.friendList = action.values.friendList
      state.chattingRoomList = action.values.chattingRoomList
      state.messageList = action.values.messageList
      return { ...state }
    case 'changeUser':
      state.user = action.values
      return state
    case 'changeFriendList': 
      state.friendList = action.values.friendList || []
      return { ...state }
    case 'updateChattingRoomList': 
      const chattingRoomList = _.get( action.values, 'chattingRoomList' ) || []
      state.chattingRoomList = _.concat( state.chattingRoomList, chattingRoomList )
      return { ...state }
    case 'updateMessageList':
      const messageList = _.get( action.values, 'messageList' ) || []
      state.messageList = _.concat( state.messageList, messageList )
      return { ...state }
    case 'updateMessageListWithChattingRoom': 
      const msgListWithChattingRoom = _( state.messageList )
        .map( message => {
          return { 
            ...message,
            key: message.roomId ? `room_${message.roomId}` : 
              message.sendUserId === state.user.userId ? `user_${message.fromUserId}` : 
              `user_${message.sendUserId}`
          }
        } )
        .groupBy( 'key' )
        .mapValues( messageList => {
          const roomId = _.find( messageList, 'roomId' )
          const chattingRoom = roomId ? _.find( state.chattingRoomList, { roomId } ) : null          
          return { messageList, chattingRoom }
        } ).value()

      const emptyMsgListWithChattingRoom = _( state.chattingRoomList )
        .filter( ( { roomId } ) => !_.find( state.messageList, { roomId } ) )
        .map( chattingRoom => {
          return {
            chattingRoom,
            key: `room_${chattingRoom.roomId}`,
          }
        } )
        .keyBy( 'key' )
        .mapValues( ( { chattingRoom } ) => {
          return {
            chattingRoom,
            messageList: null
          }
        } ).value()

      state.messageListWithChattingRoom = { ...msgListWithChattingRoom, ...emptyMsgListWithChattingRoom }
      return { ...state }
    default : 
      throw new Error( 'wrong action type' )
  }
}

function StoreProvider( props ) {
  const [ store, storeDispatch ] = useReducer( reducer, initialState )
  
  return (
    <storeContext.Provider value={store}>
      <storeDispatchContext.Provider value={storeDispatch}>
        {props.children}
      </storeDispatchContext.Provider>
    </storeContext.Provider>
  )
}


function useStoreState() {
  const context = useContext( storeContext )
  return context
}

function useStoreDispatch() {
  const context = useContext( storeDispatchContext )
  return context
}

export {
  StoreProvider,
  useStoreState,
  useStoreDispatch
}
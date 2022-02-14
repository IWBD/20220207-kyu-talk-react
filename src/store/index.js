import { createContext, useContext, useReducer } from 'react'
import _ from 'lodash'

const initialState = {
  user: {
    userId: null,
    name: null,
  },
  friendList: [],
  chattingRoomList: [],
  messageList: []
}

const storeContext = createContext( {} )
const storeDispatchContext = createContext()

function reducer( state, action ) {
  const { messageList, message, chattingRoomList, 
    chattingRoom, user, friendList } = action.values

  switch( action.type ) {
    case 'initStore':
      state.user = user
      state.friendList = friendList
      state.chattingRoomList = chattingRoomList
      state.messageList = messageList
      return { ...state }
    case 'changeUser':
      state.user = action.values
      return state
    case 'changeFriendList': 
      state.friendList = friendList || []
      return { ...state }
    case 'changeChattingRoomList': 
      if( chattingRoom && !_.isEmpty( chattingRoom ) ) {
        state.chattingRoomList = _( state.chattingRoomList )
          .filter( room => room.roomId && room.roomId !== chattingRoom.roomId )
          .concat( chattingRoom )
          .value()
      } 

      if( chattingRoomList ) {
        state.chattingRoomList = _.unionBy( chattingRoomList, state.chattingRoomList, 'roomId' )
      }

      return { ...state }
    case 'changeMessageList':
      console.log( action.values )
      if( messageList ) {
        console.log( 'asfasfasf' )
        state.messageList = _.unionBy( messageList, state.messageList, 'sendUserId' )
      }

      if( message && !_.isEmpty( message ) ) {
        console.log(message )
        state.messageList = _( state.messageList )
          .filter( ( { messageId } ) => messageId !== message.messageId )
          .concat( [ message ] )
          .value()
        state.messageList = [ ...state.messageList ]
        console.log( state.messageList )
      }

      // if( chattingRoomList ) {
      //   state.chattingRoomList = _.unionBy( chattingRoomList, state.chattingRoomList, 'roomId' )
      // }

      // if( chattingRoom && !_.isEmpty( chattingRoom ) ) {
      //   state.chattingRoomList = _( state.chattingRoomList )
      //     .filter( room => room.roomId && room.roomId !== chattingRoom.roomId )
      //     .concat( chattingRoom )
      //     .value()
      // } 

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
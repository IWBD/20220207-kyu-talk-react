import { createContext, useContext, useReducer, useEffect } from 'react'
import _ from 'lodash'
import req2svr from './req2svr'

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
      const { friendList, friend } = action.values
      if( friend && !_.isEmpty( friend ) ) {
        const friendIdx = _.findIndex( state.friendList, { userId: friend.userId } )
        if( friendIdx < 0 ) {
          state.friendList.push( friend )
        } else {
          state.friendList[friendIdx] = friend
        }
      } else {
        state.friendList = friendList || []
      }
      return state
    case 'changeChattingRoomList': 
      const { chattingRoomList, chattingRoom } = action.values
      if( chattingRoom && !_.isEmpty( chattingRoom ) ) {
        const chattingRoomIdx = _.findIndex( state.chattingRoomList, { roomId: chattingRoom.roomId } )
        if( chattingRoomIdx < 0 ) {
          state.chattingRoomList.push( chattingRoom )
        } else {
          state.chattingRoomList[chattingRoomIdx] = chattingRoom
        }
      } else {
        state.chattingRoomList = chattingRoomList || []
      }
      return state
    case 'changeMessageList':
      console.log( 'inininin' )
      const { messageList, message } = action.values
      if( message && !_.isEmpty( message ) ) {
        state.messageList = _( state.messageList )
          .filter( ( { messageId } ) => messageId !== message.messageId )
          .concat( message )
          .value()
      } else {
        state.messageList = messageList || []
      }
      console.log( 'changeMessageList', state )
      return { ...state }
    default : 
      throw new Error( 'wrong action type' )
  }
}

function StoreProvider( props ) {
  const [ store, storeDispatch ] = useReducer( reducer, initialState )

  useEffect( () => {
    let userInfo = window.localStorage.getItem( 'login-info' )
    try {
      userInfo = JSON.parse( userInfo )
    } catch( err ) {
      console.error( err )
    }

    req2svr.getUserInfo( userInfo.userId )
      .then( res => {
        if( res.code !== 200 ) {
          throw new Error( res )
        }
        storeDispatch( { type: 'initStore', values: res.payload } )
        console.log( store )
      } ).catch( err => {
        console.error( err )
      } )
  }, [] )
  
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

function useStateDispatch() {
  const context = useContext( storeDispatchContext )
  return context
}

export {
  StoreProvider,
  useStoreState,
  useStateDispatch
}
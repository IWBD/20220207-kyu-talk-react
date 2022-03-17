import { createContext, useContext, useReducer } from 'react'
import _ from 'lodash'

const initialState = {
  user: {
    userId: null,
    name: null,
  },
  userRelationList: [],
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
      state.userRelationList = action.values.userRelationList
      state.chattingRoomList = action.values.chattingRoomList
      state.messageList = action.values.messageList
      return { ...state }
    case 'changeUser':
      state.user = action.values
      return state
    case 'updateUserRelationList': 
      const updateUserRelationList = _.get( action.values, 'userRelationList' ) || []
      state.userRelationList = _( state.userRelationList )
        .filter( userRelation => !_.find( updateUserRelationList, { userId: userRelation.userId } ))
        .concat( updateUserRelationList ).value()
      return { ...state }
    case 'updateChattingRoomList': 
      const updateChattingRoomList = _.get( action.values, 'chattingRoomList' ) || []
      state.chattingRoomList = _( state.chattingRoomList )
        .filter( chattingRoom => !_.find( updateChattingRoomList, { roomId: chattingRoom.roomId } ))
        .concat( updateChattingRoomList ).value()
      return { ...state }
    case 'updateMessageList':
      const updateMessageList = _.get( action.values, 'messageList' ) || []
      state.messageList = _( state.messageList )
        .filter( ( { messageId } ) => !_.find( updateMessageList, { messageId } ) )
        .concat( updateMessageList ).value()
      return { ...state }
    case 'readMessageList': 
      const { userId, messageIdList } = action.values

      const readMessageList = _( state.messageList )
        .filter( ( { messageId } ) => _.includes( messageIdList, messageId ) )
        .map( message => {
          const fromUserList = _.map( message.fromUserList, fromUser => {
            const isRead = userId === fromUser.userId ? true : fromUser.isRead  
            return { ...fromUser, isRead }
          } )
    
          return { ...message, fromUserList }
        } )
        .value() 
      
      console.log( readMessageList )
      
      state.messageList = _( state.messageList )
        .filter( ( { messageId } ) => !_.find( readMessageList, { messageId } ) )
        .concat( readMessageList ).value()
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
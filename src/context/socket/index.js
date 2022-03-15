import { createContext, useContext } from 'react'
import socketIoClient from 'socket.io-client'
import { useStoreDispatch, useStoreState } from '@store'
import _ from 'lodash'

const SocketContext = createContext()
const socket = socketIoClient( 'localhost:3001' )

let storeDispatch = () => {}

socket.on( 'message', function( messageParams ) {
  const { chattingRoom, message } = messageParams 

  if( chattingRoom && !_.isEmpty( chattingRoom ) ) {
    storeDispatch( { type: 'updateChattingRoomList', values: { chattingRoomList: [ chattingRoom ] } } )
  }

  if( message && !_.isEmpty( message ) ) {
    storeDispatch( { type: 'updateMessageList', values: { messageList: [ message ] } } )
  }
} )

function login( userId ) {
  socket.emit( 'login', userId )
}

function SocketProvider( props ) {
  const dispatch = useStoreDispatch()
  
  storeDispatch = dispatch

  return (
    <SocketContext.Provider value={{login}}>
      {props.children}
    </SocketContext.Provider>
  )
}

function useSocket() {
  const context = useContext( SocketContext )
  return context
}

export {
  SocketProvider,
  useSocket
}
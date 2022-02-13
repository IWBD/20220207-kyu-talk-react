import { createContext, useContext } from 'react'
import socketIoClient from 'socket.io-client'
import { useStateDispatch } from '@store'

const SocketContext = createContext()
let _storeDispatch = () => {}
const socket = socketIoClient( 'localhost:3001' )

socket.on( 'message', function( message ) {
  console.log( 'message' )
  _storeDispatch( { type: 'changeMessageList', values: { message } } )
} )

function sendMessage( messageParams ) {
  socket.emit('message', messageParams )
}

function login( userId ) {
  socket.emit( 'login', userId )
}

function SocketProvider( props ) {
  const storeDispatch = useStateDispatch()
  
  _storeDispatch = storeDispatch

  return (
    <SocketContext.Provider value={{sendMessage, login}}>
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


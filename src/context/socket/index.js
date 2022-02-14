import { createContext, useContext } from 'react'
import socketIoClient from 'socket.io-client'
import { useStoreDispatch } from '@store'

const SocketContext = createContext()
const socket = socketIoClient( 'localhost:3001' )
let storeDispatch = () => {}

socket.on( 'message', function( messageParams ) {
  console.log( 'message' )
  storeDispatch( { type: 'changeMessageList', values: messageParams } )
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
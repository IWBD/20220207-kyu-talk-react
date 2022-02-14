import { createContext, useContext } from 'react'
import socketIoClient from 'socket.io-client'
import { useStoreDispatch } from '@store'

const SocketContext = createContext()
let _storeDispatch = () => {}
const socket = socketIoClient( 'localhost:3001' )

socket.on( 'message', function( messageParams ) {
  console.log( 'message' )
  _storeDispatch( { type: 'changeMessageList', values: messageParams } )
} )

function login( userId ) {
  socket.emit( 'login', userId )
}

function SocketProvider( props ) {
  const storeDispatch = useStoreDispatch()
  
  _storeDispatch = storeDispatch

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


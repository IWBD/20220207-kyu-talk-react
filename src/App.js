import './app.css'
import _ from 'lodash'
import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { PopupAnchor } from '@context/popupManager'
import { useSocket } from '@context/socket'
import { useStoreState, useStoreDispatch } from '@store'
import req2svr from './req2svr'

import Home from '@page/home'
import Login from '@page/login'
import SignUp from '@page/signUp'

function App() {
  const store = useStoreState()
  const storeDispatch = useStoreDispatch()
  const socket = useSocket()

  useEffect( () => {
    let loginInfo = window.localStorage.getItem( 'login-info' )  
    try {
      loginInfo = JSON.parse( loginInfo )
    } catch( err ) {
      console.error( err )
      return
    }

    const userId = _.get( loginInfo, 'userId' )
    if( !userId ) {
      return
    }

    req2svr.getUserInfo( userId ).then( res => {
      if( res.code !== 200 ) {
        throw new Error( res )
      }
      storeDispatch( { type: 'initStore', values: res.payload } )
      socket.login( loginInfo.userId )
    } ).catch( err => {
      console.error( err )
      return
    } )
  }, [store.user.userId, socket, storeDispatch] )

  return (
    <div className="App">
      {/* <PopupManagerProvider> */}
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/login" element={<Login/>}></Route>
          <Route path="/signUp" element={<SignUp/>}></Route>
          <Route path="/*" element={<div>404</div>}></Route>
        </Routes>
        <PopupAnchor></PopupAnchor>
      {/* </PopupManagerProvider> */}
    </div>
  )
}

export default App

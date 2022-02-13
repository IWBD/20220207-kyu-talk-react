import './app.css'
import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { PopupManagerProvider } from '@context/popupManager'
import { useSocket } from '@context/socket'
import Home from '@page/home'
import Login from '@page/login'
import SignUp from '@page/signUp'

function App() {

  const socket = useSocket()
  console.log( 'app' )

  useEffect( () => {
    let loginInfo = window.localStorage.getItem( 'login-info' )
    try {
      loginInfo = JSON.parse( loginInfo )
      socket.login( loginInfo.userId )
    } catch( err ) {
      console.error( err )
    }
  }, [] )

  return (
    <div className="App">
      <PopupManagerProvider>
      {/* <StoreProvider> */}
          <Routes>
            <Route path="/" element={<Home/>}></Route>
            <Route path="/login" element={<Login/>}></Route>
            <Route path="/signUp" element={<SignUp/>}></Route>
            <Route path="/*" element={<div>404</div>}></Route>
          </Routes>
      {/* </StoreProvider>  */}
      </PopupManagerProvider>
    </div>
  )
}

export default App

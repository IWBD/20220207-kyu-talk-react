import './app.css'
import { Routes, Route } from 'react-router-dom'
import { PopupManagerProvider } from '@context/popupManager'
import Home from '@page/home'
import SignInUser from '@page/signInUser'
import SignUpUser from '@page/signUpUser'

function App() {
  return (
    <PopupManagerProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/signInUser" element={<SignInUser/>}></Route>
          <Route path="/signUpUser" element={<SignUpUser/>}></Route>
        </Routes>
      </div>
    </PopupManagerProvider>
  )
}

export default App

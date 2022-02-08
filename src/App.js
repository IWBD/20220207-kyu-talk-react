import './app.css'
import { Routes, Route } from 'react-router-dom'
import { PopupManagerProvider } from '@context/popupManager'
import Home from '@page/home'
import SignInUser from '@page/signInUser'


function App() {
  return (
    <PopupManagerProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/signInUser" element={<SignInUser/>}></Route>
        </Routes>
      </div>
    </PopupManagerProvider>
  )
}

export default App

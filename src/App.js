import Home from '@page/home'
import { PopupManagerProvider } from '@context/popupManager'
import './app.css'

function App() {
  return (
    <PopupManagerProvider>
      <div className="App">
        <Home></Home>
      </div>
    </PopupManagerProvider>
  )
}

export default App

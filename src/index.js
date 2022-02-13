import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { BrowserRouter } from 'react-router-dom'
import { StoreProvider } from './store'
import { SocketProvider } from '@context/socket'

const pathname = window.location.pathname
if( pathname === '/' ) {
  if( !window.localStorage.getItem( 'login-info' ) ) {
    window.location = '/login'
  }
} 

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <StoreProvider>
        <SocketProvider>
          <App/>
        </SocketProvider>
      </StoreProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById( 'root' )
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()

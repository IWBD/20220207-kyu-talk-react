import styles from './styles.module.scss'
import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStoreDispatch } from '@store'
import { useSocket } from '@context/socket'
import req2svr from './req2svr'

function SignInUser() {
  const [ userId, setUserId ] = useState( '' )
  const [ password, setPassword ] = useState( '' )
  const storeDispatch = useStoreDispatch()
  const socket = useSocket()
  const navigate = useNavigate()

  const onInputUserId = useCallback( ( event ) => {
    setUserId( event.target.value )
  }, [] )

  const onInputPasswrod = useCallback( ( event ) => {
    setPassword( event.target.value )
  }, [] )

  const onLogin = async () => {
    try { 
      let res = await req2svr.login( { userId, password } )  
      if( res.code !== 200 ) {
        throw new Error( res )
      }
      window.localStorage.setItem( 'login-info', JSON.stringify( { authToken: 'agaghajgsadgdsh', userId: userId } ) )
      storeDispatch( { type: 'initStore', values: res.payload } )
      socket.login( res.payload.user.userId )
      navigate( '/' )
    } catch ( err ) {
      console.error( err )
      alert( '로그인에 실패하였습니다.' )
    }
  }

  function routingToSign() {
    navigate( '/signUp' )
  }
  
  return (
    <div className={styles.signInUserWrapper}>
      <div className={styles.title}>sign</div> 
      <input className={styles.inputFiledArea} value={userId} onInput={onInputUserId}/>
      <input className={styles.inputFiledArea} value={password} onInput={onInputPasswrod}/>
      <button className={styles.signInButton} onClick={onLogin}>로그인</button>
      <button className={styles.signInButton} onClick={routingToSign}>회원가입</button>
    </div>
  )
}

export default React.memo( SignInUser )
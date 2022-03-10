import './styles.scss'
import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStoreDispatch } from '@store'
import { useSocket } from '@context/socket'
import req2svr from './req2svr'
import TextFiled from '@component/textField'

function SignInUser() {
  const [ userId, setUserId ] = useState( '' )
  const [ password, setPassword ] = useState( '' )
  const storeDispatch = useStoreDispatch()
  const socket = useSocket()
  const navigate = useNavigate()

  const onInputUserId = useCallback( ( value ) => {
    setUserId( value )
  }, [] )

  const onInputPasswrod = useCallback( ( value ) => {
    setPassword( value )
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
    <div className="sign-in-user-wrapper">
      <div className="sign-in-title">talk</div> 
      <div className="sign-in-content">
        <TextFiled value={userId} 
                  onChange={onInputUserId}
                  placeholder="아이디"></TextFiled>
        <TextFiled value={password} 
                   type="password"
                   onChange={onInputPasswrod}
                   placeholder="비밀번호"></TextFiled>
      </div>
      <div className="sign-in-button-area">
        <div className="sign-in-button" onClick={onLogin}>로그인</div>
        <div className="sign-in-button" onClick={routingToSign}>회원가입</div>
      </div>
    </div>
  )
}

export default React.memo( SignInUser )
// import styles from './styles.module.scss'
import './styles.scss'
import _ from 'lodash'
import React, { useState, useEffect } from 'react'
import req2svr from './req2svr'
import { useNavigate } from 'react-router-dom'
import TextFiled from '@component/textField'


// setState는 비동기 함수라 항상 최신값을 유지한다는 보장이 없다. 
// 비동기 함수를 호출할 경우 사용하는 모든 state를 dependency로 넣어야한다
function SignUpUser() {
  const [ userId, setUserId ] = useState( '' )
  const [ password, setPassword ] = useState( '' )
  const [ verificationPassword, setVerificationPassword ] = useState( '' )
  const [ name, setName ] = useState( '' )
  const [ userIdAvailable, setUserIdAvailable ] = useState( '' )
  const navigate = useNavigate()

  const onChangeUserId = ( value ) => {
    setUserId( value )
  }

  const onChangePassword = ( value ) => {
    setPassword( value )
  }

  const onChangeVerificationPassword = ( value ) => {
    setVerificationPassword( value )
  }

  const onChangeName = ( value ) => {
    setName( value )
  }

  const checkDuplication = async () => {
    if( !userId ) {
      return 
    }

    try {
      const res = await req2svr.checkDuplication( userId )
      const isAvailable = _.get( res, 'data.payload.isAvailable' )
      setUserIdAvailable( !!isAvailable )  
    } catch( err ) {
      console.error( err )
      setUserIdAvailable( '' )  
    }
  }

  const onSignUpUser = async () => {
    if( !userId || !password || !verificationPassword || !name ) {
      alert( '비어있는 필드가 있습니다.' )
      return
    } else if( !userIdAvailable ) {
      alert( '아이디 중복확인을 해주세요.' )
      return
    } else if( password !== verificationPassword ) {
      alert( '비밀번호를 확인하세요.' )
      return
    }

    try {
      const res = await req2svr.signUpUser( { userId, password, verificationPassword, name } )
      if( res.status !== 200 ) {
        throw new Error( 'sign up fail' )
      }
      navigate( '/login' )
    } catch( err ) {
      console.error( err )
    }
  }

  function routingToLogin() {
    navigate( '/login' )
  }

  useEffect( () => {
    setUserIdAvailable( false )
  }, [userId] )

  return (
    
    <div className="sign-up-wrapper">
      <div className="sign-up-title">회원가입</div> 
      <div className="sign-up-contents">
        <TextFiled value={userId}
                   placeholder="아이디 입력"
                   onChange={onChangeUserId}></TextFiled>
        <div className="duplication-button" onClick={checkDuplication}>{ userIdAvailable ? '확인 완료' : '중복 확인' }</div>
        <TextFiled value={name}
                   placeholder="이름 입력"
                   onChange={onChangeName}></TextFiled>
        <TextFiled value={password}
                   type="password"
                   placeholder="비밀번호"
                   onChange={onChangePassword}></TextFiled>
        <TextFiled value={verificationPassword}
                   type="password"
                   placeholder="비밀번호 확인"
                   onChange={onChangeVerificationPassword}></TextFiled>
      </div> 
      <div className="sign-up-button-area">
        <div className="sign-up-button" onClick={onSignUpUser}>회원가입</div>
        <div className="sign-up-button" onClick={routingToLogin}>로그인하기</div>
      </div> 
    </div>
  )
}

export default React.memo( SignUpUser )
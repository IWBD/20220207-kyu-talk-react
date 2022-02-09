import styles from './styles.module.scss'
import _ from 'lodash'
import React, { useState, useCallback, useEffect } from 'react'
import req2svr from './req2svr'
import { useNavigate } from 'react-router-dom'


// setState는 비동기 함수라 항상 최신값을 유지한다는 보장이 없다. 
// 비동기 함수를 호출할 경우 사용하는 모든 state를 dependency로 넣어야한다
function SignUpUser() {
  const [ userId, setUserId ] = useState( '' )
  const [ password, setPassword ] = useState( '' )
  const [ verificationPassword, setVerificationPassword ] = useState( '' )
  const [ name, setName ] = useState( '' )
  const [ userIdAvailable, setUserIdAvailable ] = useState( '' )
  const navigate = useNavigate()

  const onInputUserId = useCallback( event => {
    setUserId( event.target.value )
  }, [] )

  const onInputPassword = useCallback( event => {
    setPassword( event.target.value )
  }, [] )

  const onInputVerificationPassword = useCallback( event => {
    setVerificationPassword( event.target.value )
  }, [] )

  const onInputName = useCallback( event => {
    setName( event.target.value )
  }, [] )

  const checkDuplication = useCallback( async () => {
    try {
      const res = await req2svr.checkDuplication( userId )
      const isAvailable = _.get( res, 'data.payload.isAvailable' )
      setUserIdAvailable( !!isAvailable )  
    } catch( err ) {
      console.error( err )
      setUserIdAvailable( '' )  
    }
  }, [userId] )

  const onSignUpUser = useCallback( async () => {
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
      if( res.ststus !== 200 ) {
        throw new Error( 'sign up fail' )
      }
      navigate( '/signInUser' )
    } catch( err ) {
      console.error( err )
    }
  }, [ userId, password, verificationPassword, name, userIdAvailable, navigate ] )

  useEffect( () => {
    setUserIdAvailable( false )
  }, [userId] )

  return (
    <div className={styles.signUpUserWrapper}>
      <div className={styles.title}>sign</div> 
      <div className={styles.inputFiledArea}>
        <input className={styles.inputFiledArea} 
               placeholder="아이디 입력"
               value={userId} 
               onChange={onInputUserId}/>
        <button onClick={checkDuplication}>{ userIdAvailable ? '확인 완료' : '중복 확인' }</button>
      </div>
      <div className={styles.inputFiledArea}>
        <input className={styles.inputFiledArea} 
               placeholder="이름 입력"
               value={password} 
               onInput={onInputPassword}/>
      </div>
      <div className={styles.inputFiledArea}>
        <input className={styles.inputFiledArea} 
               placeholder="비밀번호"
              value={verificationPassword} 
              onInput={onInputVerificationPassword}/>
      </div>
      <div className={styles.inputFiledArea}>
        <input className={styles.inputFiledArea} 
               placeholder="비밀번호 확인"
              value={name} 
              onInput={onInputName}/>
      </div>
      <button className={styles.signInButton} onClick={onSignUpUser}>회원가입</button>
    </div>
  )
}

export default React.memo( SignUpUser )
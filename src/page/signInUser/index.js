import styles from './styles.module.scss'
import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

function SignInUser() {
  const [ userId, setUserId ] = useState( '' )
  const [ password, setPassword ] = useState( '' )
  const navigate = useNavigate()

  const onInputUserId = useCallback( ( event ) => {
    setUserId( event.target.value )
  }, [] )

  const onInputPasswrod = useCallback( ( event ) => {
    setPassword( event.target.value )
  }, [] )
  
  const onSignInUser = useCallback( () => {
    navigate( '/' )
  }, [ navigate ] )  
  
  return (
    <div className={styles.signInUserWrapper}>
      <div className={styles.title}>sign</div> 
      <input className={styles.inputFiledArea} value={userId} onInput={onInputUserId}/>
      <input className={styles.inputFiledArea} value={password} onInput={onInputPasswrod}/>
      <button className={styles.signInButton} onClick={onSignInUser}>로그인</button>
    </div>
  )
}

export default React.memo( SignInUser )
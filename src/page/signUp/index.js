import styles from './styles.module.scss'
import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

function SignUpUser() {
  const [ userId, setUserId ] = useState( '' )
  const [ password, setPassword ] = useState( '' )
  const [ verificationPassword, setVerificationPassword ] = useState( '' )
  const [ name, setName ] = useState( '' )

  const onInputUserId = useCallbeck( event => {
    setUserId( event.target.value )
  }, [userId] )

  return (
    <div className={styles.signInUserWrapper}>
      <div className={styles.title}>sign</div> 
      <div className={styles.inputFiledArea}>
        <input className={styles.inputFiledArea} 
               placeholder="아이디 입력"
               value={userId} 
               onInput={onInputUserId}/>
        <button>중복확인</button>
      </div>
      <div className={styles.inputFiledArea}>
        <input className={styles.inputFiledArea} 
               placeholder="이름 입력"
               value={userId} 
               onInput={onInputUserId}/>
      </div>
      <div className={styles.inputFiledArea}>
        <input className={styles.inputFiledArea} 
               placeholder="비밀번호"
              value={userId} 
              onInput={onInputUserId}/>
      </div>
      <div className={styles.inputFiledArea}>
        <input className={styles.inputFiledArea} 
               placeholder="비밀번호 확인"
              value={userId} 
              onInput={onInputUserId}/>
      </div>
      <button className={styles.signInButton} onClick={onSignInUser}>회원가입</button>
    </div>
  )
}

export default React.memo( SignUpUser )
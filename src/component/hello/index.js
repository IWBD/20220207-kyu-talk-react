import './hello.scoped.scss'
// import { usePopupManager } from '@context/popupManager'
import React from 'react'

function Hello( props ) {
  // const popupManager = usePopupManager()
  // console.log( 'Hello' )
  // const onClosePopup = () => {
  //   popupManager.close( props.popupKey, { message: `${props.popupKey} close` } )
  // }

  return (
    <div className="title">
      Hello
      {/* <span>{props.popupKey}</span>
      <button onClick={onClosePopup}>닫기</button>        */}
    </div>
  )
}

export default Hello
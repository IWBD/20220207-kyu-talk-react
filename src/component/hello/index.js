import './hello.scoped.scss'
import { usePopupManager } from '@context/popupManager'

function Hello( props ) {
  const popupManager = usePopupManager()

  const onClosePopup = () => {
    popupManager.close( props.popupKey, { message: `${props.popupKey} close` } )
  }

  return (
    <div className="title">
      <span>{props.popupKey}</span>
      <button onClick={onClosePopup}>닫기</button>       
    </div>
  )
}

export default Hello
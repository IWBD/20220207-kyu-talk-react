import { usePopupManager } from '@context/popupManager' 
import './styles.scoped.scss'
import CustomCheckBox from '@component/customCheckBox'
import { useState } from 'react'

import Icon from '@component/icon'
import TextFiled from '@component/textField'

function AddChattingRoom( props ) {
  const popupManager = usePopupManager()
  const [ searchWord, setSearchWord ] = useState( '' )

  const closePopup = ( param ) => {
    popupManager.close( props.popupKey, param )
  }

  const onChangeSearchWord = ( value ) => {
    setSearchWord( value )
  }


  return (
    <div className="add-chatting-room-wrapper">
      <div className="header">
        <div className="close-btn" onClick={() => closePopup()}>
          <Icon>close</Icon>
        </div>
        <span className="title">대화상대 초대</span>
        <div className="complate-btn">확인</div>
      </div>
      <div className="search-field">
        <TextFiled onChange={onChangeSearchWord} 
                  value={searchWord}
                  placeholder="이름, 혹은 아이디 입력"></TextFiled>
      </div>
      <div className="body">
      </div>
    </div>
  )  
}


export default AddChattingRoom
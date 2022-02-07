import './popup.scoped.scss'

function PopupAnchor( { popupList } ) {
  return (
    <div className="popup-anchor">
      { popupList.map( ( popup, index ) => {
          const params = popup.params || {}
          params.popupKey = popup.popupKey
          return <div className="popup-wrapper" key={`${popup.popupKey}_anchor_${index}`}>
            <div className="popup-container">
              <popup.component {...params}></popup.component>
            </div>
          </div>
      } ) }
    </div> 
  )  
}

export default PopupAnchor
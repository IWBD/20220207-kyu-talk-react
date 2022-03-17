import { useState } from 'react'
import './popup.scoped.scss'

let nextKey = 0
let popupList
let popupListDispatch

const popupManager = {
  open: function( component, params, options ) {
    if( !component ) {
      throw new Error( 'component is null' )
    }
    
    const popupKey = `_popup_key_${nextKey++}`
    
    let resolve
    let promise = new Promise( ( rs, rj ) => { resolve = rs } )
    
    popupListDispatch( [ ...popupList, { component, popupKey, params, options, resolve } ] )
    
    return { popupKey, promise }
  },
  close: function( inst, params ) {
    if( !inst || !popupList.length ) {
      return 
    }

    const targetIndex = popupList.findIndex( ( popup ) => {
      return popup.popupKey === inst
    } )

    if( targetIndex > -1 ) {
      const resolve = popupList[targetIndex].resolve
      
      const editPopupList = [ ...popupList ]
      editPopupList.splice( targetIndex, 1 )
      
      resolve( params )
      
      popupListDispatch( editPopupList )
    }
  } 
}

function PopupAnchor() {
  const [ list, setList ] = useState( [] )
  popupList = list
  popupListDispatch = setList
  
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

function usePopupManager() {
  return popupManager
}

export {
  PopupAnchor,
  usePopupManager
}
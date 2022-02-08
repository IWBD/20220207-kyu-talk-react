import { createContext, useContext, useState } from 'react'
import PopupAnchor from './popupAnchor'

let nextKey = 0 

const PopupManagerContext = createContext()

function PopupManagerProvider( props ) {
  const [ popupList, setPopupList ] = useState( [] )
  
  const open = ( component, params, options ) => {
    if( !component ) {
      throw new Error( 'component is null' )
    }
    
    const popupKey = `_popup_key_${nextKey++}`
    
    let resolve
    let promise = new Promise( ( rs, rj ) => { resolve = rs } )

    const editPopupList = [ ...popupList ]
    editPopupList.push( { component, popupKey, params, options, resolve } )
    
    setPopupList( editPopupList )
    
    return { popupKey, promise }
  }
  
  const close = ( inst, params ) => {
    if( !inst || !popupList.length ) {
      return 
    }

    const targetIndex = popupList.findIndex( ( popup ) => {
      return popup.popupKey === inst
    } )

    if( targetIndex > -1  ) {
      const resolve = popupList[targetIndex].resolve
      
      const editPopupList = [ ...popupList ]
      editPopupList.splice( targetIndex, 1 )
      
      resolve( params )
      
      setPopupList( editPopupList )
    }

    return
  }
  
  return (
    <PopupManagerContext.Provider value={{open, close}}>
      {props.children}
      <PopupAnchor popupList={popupList}></PopupAnchor>
    </PopupManagerContext.Provider>
  )
}

function usePopupManager() {
  const context = useContext( PopupManagerContext )
  return context
}

export {
  PopupManagerProvider,
  usePopupManager
}
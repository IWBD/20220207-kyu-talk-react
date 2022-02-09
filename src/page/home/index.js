import React, { useState } from 'react'
// import req2svr from './req2svr'

import Hello from '@component/hello'
// import { usePopupManageer } from '@context/popupManager'

function Home() {
  console.log( 'inininini' )
  const [ count, setCount ] = useState( 0 )
  // const popupManager = usePopupManageer()
  
  const onOpenPopup = async () => {
    // let res = await req2svr.signInUser( 'test', '1234' )
    // let res = await popupManager.open( Hello )
    setCount( count + 1 )
  }
  
  return (
    <div>
      popup test
      <button onClick={onOpenPopup}>openPopup</button>
      <Hello></Hello>
    </div>
  )
}

export default Home
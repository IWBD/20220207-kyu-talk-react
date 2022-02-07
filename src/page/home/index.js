import Test from '@component/hello'
import { usePopupManager } from '@context/popupManager'

function Home() {
  const popupManager = usePopupManager()
  
  const onOpenPopup = async () => {
    let res = await popupManager.open( Test ).promise
    console.log( res )
  }
  
  return (
    <div>
      popup test
      <button onClick={onOpenPopup}>openPopup</button>
    </div>
  )
}

export default Home
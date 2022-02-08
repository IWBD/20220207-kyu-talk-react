import req2svr from './req2svr'

function Home() {
  
  const onOpenPopup = async () => {
    let res = await req2svr.signInUser( 'test', '1234' )
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
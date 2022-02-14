import axios from 'axios'

const req2svr = {
  getUserInfo( userId ) {
    return axios.get( 'http://localhost:3001/api/user/getuserinfo', { params: { userId } }  )
      .then( res => res.data )
  }
}

export default req2svr
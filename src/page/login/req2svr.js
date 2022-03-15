import axios from 'axios'

const req2svr = {
  login( user ) {
    return axios.post( 'http://localhost:3001/api/user/login', user )
      .then( res => res.data )
  },
  getUserInfo( userId ) {
    return axios.get( 'http://localhost:3001/api/user/getuserinfo', { params: { userId } }  )
      .then( res => res.data )
  }
}

export default req2svr
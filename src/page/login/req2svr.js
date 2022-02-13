import axios from 'axios'

const req2svr = {
  login( user ) {
    return axios.post( 'http://localhost:3001/api/user/login', user )
      .then( res => res.data )
  },
}

export default req2svr
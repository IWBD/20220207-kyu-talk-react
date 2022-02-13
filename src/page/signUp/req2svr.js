import axios from 'axios'

const req2svr = {
  signUpUser( user ) {
    return axios.post( 'http://localhost:3001/api/user/signupuser', {
      user
    } )
  },
  checkDuplication( userId ) {
    return axios.get( 'http://localhost:3001/api/user/checkduplication', { params: { userId } } )
  }
}

export default req2svr
import _ from 'lodash'
import axios from 'axios'

export default {
  signInUser( userId, password ) {
    return axios.post( 'http://localhost:3001/api/user/signinuser', {
      userId, password
    } )
  },
}

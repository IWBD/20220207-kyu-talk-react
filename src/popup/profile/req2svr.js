import axios from 'axios'

const req2svr = {
  addFriend( userId, targetUserId ) {
    return axios.post( 'http://localhost:3001/api/user/addfriend', { userId, targetUserId } ).then( res => res.data )
  }
}

export default req2svr
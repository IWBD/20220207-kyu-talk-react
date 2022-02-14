import axios from 'axios'

const req2svr = {
  searchUser( userId, searchWord ) {
    return axios.get( 'http://localhost:3001/api/user/searchuser', { params: { userId, searchWord } }  )
      .then( res => res.data )
  }
}

export default req2svr
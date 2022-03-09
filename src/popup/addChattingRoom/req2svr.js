import axios from 'axios'

const req2svr = {
  addChattingRoom( createUserId, roomUser ) {
    return axios.post( 'http://localhost:3001/api/chatting/addchattingroom', { createUserId, roomUser } ).then( res => res.data )
  }
}

export default req2svr
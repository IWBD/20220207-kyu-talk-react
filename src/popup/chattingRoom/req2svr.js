import axios from 'axios'

const req2svr = {
  sendMessage( messageParams ) {
    return axios.post( 'http://localhost:3001/api/chatting/sendmessage', messageParams ).then( res => res.data )
  },
  readMessage( messageParams ) {
    return axios.post( 'http://localhost:3001/api/chatting/readmessage', messageParams ).then( res => res.data )
  },
}

export default req2svr
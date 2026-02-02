import { io } from 'socket.io-client';

 const socket = io(import.meta.env.VITE_SOCKET_URL, {
//   auth: {
//     token: localStorage.getItem('accessToken'),
//   },
  withCredentials: true,
});

export default socket
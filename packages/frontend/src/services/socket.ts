import { io } from 'socket.io-client';

const getServerUrl = () => {
  if (typeof window !== 'undefined') {
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:3000';
    }

    return `${protocol}//${hostname}:3000`;
  }

  return 'http://localhost:3000';
};

export const socket = io(getServerUrl(), {
  transports: ['websocket', 'polling'],
  withCredentials: true,
});

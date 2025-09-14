import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setSocketId } from '../store/ballsSlice';
import { socket } from '../services';

export const useSocketConnection = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    socket.connect();

    function onConnect() {
      if (socket.id) {
        console.log('✅ Connected. ID:', socket.id);
        dispatch(setSocketId(socket.id));
      }
    }

    socket.on('connect', onConnect);

    return () => {
      socket.off('connect', onConnect);
      socket.disconnect();
    };
  }, [dispatch]);
};

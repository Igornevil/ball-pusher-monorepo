import { useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { GAME_STATUS } from './constants';
import s from './game.module.scss';
import { GameOverlay } from './ui/gameOverlay';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { useSocketConnection } from '../../hooks/useSocketConnection';
import { socket } from '../../services';
import {
  roomConnectionAttempt,
  roomConnectionSuccess,
  roomConnectionFailure,
  leaveRoom,
} from '../../store/ballsSlice';
import Canvas from './Canvas';
import { ServerErrorToast } from '../../components';
import { Timer } from './ui';

export default function Game() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hasHandledInitialRoom = useRef(false);

  const gameStatus = useAppSelector((state) => state.game.room.gameStatus);
  const roomId = useAppSelector((state) => state.game.room.id);
  const isSocketConnected = useAppSelector((state) => !!state.game.socketId);

  const gameLive = gameStatus === GAME_STATUS.LIVE;

  useSocketConnection();

  useEffect(() => {
    if (!isSocketConnected || hasHandledInitialRoom.current) return;

    const urlRoomId = searchParams.get('room');

    if (urlRoomId && urlRoomId !== roomId) {
      console.log('🔗 Підключаємося до кімнати з URL:', urlRoomId);
      hasHandledInitialRoom.current = true;
      dispatch(roomConnectionAttempt());

      socket.emit(
        'join_room',
        urlRoomId,
        (response: { success: boolean; error?: string }) => {
          if (response.success) {
            console.log('✅ Успішно підключилися до кімнати');
            dispatch(roomConnectionSuccess({ roomId: urlRoomId }));
          } else {
            const errorMsg = response.error || 'Невідома помилка підключення';
            console.warn('❌ Не вдалося підключитися до кімнати:', errorMsg);
            dispatch(roomConnectionFailure({ error: errorMsg }));

            const newSearchParams = new URLSearchParams(searchParams);
            newSearchParams.delete('room');
            navigate(`?${newSearchParams.toString()}`, { replace: true });
          }
        },
      );
    } else if (urlRoomId && urlRoomId === roomId) {
      console.log('✅ Вже підключені до цієї кімнати');
      hasHandledInitialRoom.current = true;
    } else if (!urlRoomId && roomId) {
      console.log('🗑️ Очищаємо URL і виходимо з кімнати');
      dispatch(leaveRoom());
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('room');
      navigate(`?${newSearchParams.toString()}`, { replace: true });
      hasHandledInitialRoom.current = true;
    } else {
      hasHandledInitialRoom.current = true;
    }
  }, [dispatch, navigate, searchParams, roomId, isSocketConnected]);

  return (
    <div className={s.container}>
      <ServerErrorToast />
      <Canvas />
      {!gameLive && <GameOverlay />}
      {gameLive && <Timer />}
    </div>
  );
}

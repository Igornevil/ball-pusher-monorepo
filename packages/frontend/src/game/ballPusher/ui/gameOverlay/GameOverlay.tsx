import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks.js';
import {
  roomConnectionAttempt,
  roomConnectionFailure,
  roomConnectionSuccess,
} from '../../../../store/ballsSlice.js';
import { socket } from '../../../../services/index.js';
import s from './styles.module.scss';
import { shallowEqual } from 'react-redux';
import { GAME_STATUS } from '../../constants/GAME_STATUS.js';
import { ShareLink } from '../shareLink/ShareLink.js';
import Settings from '../settings/Setting.js';
import { STATUS } from '../../../../constant/STATUS.js';

// Допоміжна функція для форматування часу
const formatTime = (ms: number) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const milliseconds = ms % 1000;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
};

// --- Компонент для відображення результатів ---
const ResultPanel = ({ duration }: { duration: number | null }) => (
  <div className={s.resultPanel}>
    <h2 className={s.resultTitle}>Гру завершено!</h2>
    <p className={s.resultTimeLabel}>Ваш фінальний час:</p>
    <p className={s.resultTime}>
      {duration ? formatTime(duration) : '00:00.000'}
    </p>
  </div>
);

export const GameOverlay = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const setting = useAppSelector((state) => state.game.setting);
  const {
    status: roomStatus,
    id: roomId,
    gameStatus,
    gameDuration,
    users,
  } = useAppSelector((state) => state.game.room);
  const userIds = useAppSelector(
    (state) => Object.keys(state.game.room.users),
    shallowEqual,
  );

  const isConnecting = roomStatus === STATUS.CONNECTING;
  const isGameFinished = gameStatus === GAME_STATUS.FINISHED;
  const isInLobby = roomId && !isGameFinished;
  const canCreateGame =
    setting && setting.colorGroups > 0 && setting.ballsPerGroup > 0;

  const handleCreateNewGame = () => {
    if (!canCreateGame) {
      const errorMsg = 'Не введено коректні налаштування для гри';
      dispatch(roomConnectionFailure({ error: errorMsg }));
      return;
    }
    dispatch(roomConnectionAttempt());
    socket.emit(
      'create_game',
      setting,
      (response: { success: boolean; roomId?: string; error?: string }) => {
        if (response.success && response.roomId) {
          dispatch(roomConnectionSuccess({ roomId: response.roomId }));
          const newSearchParams = new URLSearchParams();
          newSearchParams.set('room', response.roomId);
          navigate(`?${newSearchParams.toString()}`, { replace: true });
        } else {
          const errorMsg =
            response.error || 'Невідома помилка створення кімнати';
          dispatch(roomConnectionFailure({ error: errorMsg }));
        }
      },
    );
  };

  const handleStartGame = () => {
    if (!roomId) return;
    socket.emit(
      'start_game',
      (response: { success: boolean; error?: string }) => {
        if (!response.success) {
          const errorMsg = response.error || 'Помилка старту гри';
          dispatch(roomConnectionFailure({ error: errorMsg }));
        }
      },
    );
  };

  return (
    <div className={s.overlay}>
      <div className={s.contentWrapper}>
        <h1 className={s.title}>Сортувальник Кульок</h1>

        {/* --- Відображаємо результати, якщо гра завершена --- */}
        {isGameFinished && <ResultPanel duration={gameDuration} />}

        {isConnecting ? (
          <div className={s.loader}></div>
        ) : isInLobby ? (
          // --- Стан "Лобі" ---
          <div className={s.lobby}>
            <div className={s.playerList}>
              <strong>Гравці ({userIds.length} / 4):</strong>
              <ul>
                {Object.values(users).map((user) => (
                  <li key={user.id}>
                    <span
                      className={s.playerColorIndicator}
                      style={{ backgroundColor: user.cursorColor }}
                    ></span>
                    {user.name}
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={handleStartGame}
              className={classNames(s.button, s.primary)}
            >
              Почати гру
            </button>
            <ShareLink roomId={roomId} />
          </div>
        ) : (
          <div className={s.mainMenu}>
            <Settings />
            <button
              onClick={handleCreateNewGame}
              className={classNames(s.button, !canCreateGame ? s.disabled : '')}
              disabled={!canCreateGame}
            >
              Створити нову кімнату
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

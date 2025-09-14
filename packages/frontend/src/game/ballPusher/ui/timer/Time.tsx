import { useState, useEffect } from 'react';
import s from './styles.module.scss';
import { useAppSelector } from '../../../../store/hooks';
import { GAME_STATUS } from '../../constants';

const formatTime = (ms: number) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const milliseconds = ms % 1000;

  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
};

export const Timer = () => {
  const { gameStatus, gameStartTime, gameDuration } = useAppSelector(
    (state) => state.game.room,
  );

  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let animationFrameId: number;

    // Оновлюємо таймер, тільки якщо гра активна
    if (gameStatus === GAME_STATUS.LIVE && gameStartTime) {
      const updateTimer = () => {
        setElapsedTime(Date.now() - gameStartTime);
        animationFrameId = requestAnimationFrame(updateTimer);
      };
      animationFrameId = requestAnimationFrame(updateTimer);
    }

    // Очищаємо анімацію, коли гра неактивна
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameStatus, gameStartTime]);

  // Визначаємо, що відображати
  let displayTime = '00:00.000';
  if (gameStatus === GAME_STATUS.FINISHED && gameDuration) {
    displayTime = formatTime(gameDuration);
  } else if (gameStatus === GAME_STATUS.LIVE) {
    displayTime = formatTime(elapsedTime);
  }

  if (gameStatus !== GAME_STATUS.LIVE && gameStatus !== GAME_STATUS.FINISHED) {
    return null;
  }

  return (
    <div className={s.timerContainer}>
      <p>{displayTime}</p>
    </div>
  );
};

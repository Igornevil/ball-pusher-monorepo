import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { removeError, type ErrorState } from '../../store/ballsSlice';
import s from './styles.module.scss';

const Toast: React.FC<{ error: ErrorState }> = ({ error }) => {
  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(removeError({ id: error.id }));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [error.id, dispatch]);

  return (
    <div className={s.serverErrorToast}>
      <div className={s.toastMessage}>
        <strong>Помилка:</strong> {error.message}
      </div>
      <button className={s.toastCloseButton} onClick={handleClose}>
        &times;
      </button>
    </div>
  );
};

export const ServerErrorToast: React.FC = () => {
  const errors = useAppSelector((state) => state.game.errors);

  if (!errors || errors.length === 0) {
    return null;
  }

  return (
    <div className={s.toastsContainer}>
      {errors.map((error) => (
        <Toast key={error.id} error={error} />
      ))}
    </div>
  );
};

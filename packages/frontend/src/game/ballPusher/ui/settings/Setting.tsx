import { setPath } from '../../../../store/ballsSlice';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { BALL_COLORS, GAME_STATUS } from '../../constants';
import s from './styles.module.scss';

interface SettingControlProps {
  label: string;
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  disabled?: boolean;
}

const SettingControl = ({
  label,
  value,
  onIncrement,
  onDecrement,
  disabled,
}: SettingControlProps) => (
  <div className={s.settingControl}>
    <p className={s.settingLabel}>{label}</p>
    <div className={s.valueControl}>
      <button
        onClick={onDecrement}
        className={s.adjustButton}
        disabled={disabled}
      >
        -
      </button>
      <span className={s.valueDisplay}>{value}</span>
      <button
        onClick={onIncrement}
        className={s.adjustButton}
        disabled={disabled}
      >
        +
      </button>
    </div>
  </div>
);

export default function Settings() {
  const dispatch = useAppDispatch();
  const { setting, room } = useAppSelector((state) => state.game);
  const { ballsPerGroup, colorGroups } = setting;

  const isSettingsDisabled = !!room.id && room.gameStatus === GAME_STATUS.READY;

  const handleSettingChange = (path: string[], newValue: number) => {
    dispatch(setPath({ path, value: newValue }));
  };

  return (
    <div className={s.settingsContainer}>
      <SettingControl
        label="Кількість кольорів"
        value={colorGroups}
        onIncrement={() =>
          handleSettingChange(
            ['setting', 'colorGroups'],
            Math.min(colorGroups + 1, Object.keys(BALL_COLORS).length),
          )
        }
        onDecrement={() =>
          handleSettingChange(
            ['setting', 'colorGroups'],
            Math.max(colorGroups - 1, 2),
          )
        }
        disabled={isSettingsDisabled}
      />
      <SettingControl
        label="Кульок на колір"
        value={ballsPerGroup}
        onIncrement={() =>
          handleSettingChange(
            ['setting', 'ballsPerGroup'],
            Math.min(ballsPerGroup + 1, 10),
          )
        }
        onDecrement={() =>
          handleSettingChange(
            ['setting', 'ballsPerGroup'],
            Math.max(ballsPerGroup - 1, 2),
          )
        }
        disabled={isSettingsDisabled}
      />
    </div>
  );
}

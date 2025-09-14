import s from './styles.module.scss';

interface ShareLinkProps {
  roomId: string;
}

export const ShareLink = ({ roomId }: ShareLinkProps) => {
  const shareLink = `${window.location.origin}${window.location.pathname}?room=${roomId}`;

  return (
    <div className={s.container}>
      <span>🔗 Посилання:</span>
      <input
        value={shareLink}
        readOnly
        className={s.input}
        onFocus={(e) => e.target.select()}
      />
    </div>
  );
};

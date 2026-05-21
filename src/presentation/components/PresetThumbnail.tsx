import type { PresetImage } from '../../application';

type Props = {
  preset: PresetImage;
  onClick: () => void;
  disabled?: boolean;
};

export function PresetThumbnail({ preset, onClick, disabled = false }: Props) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      style={{
        padding: 0,
        border: '2px solid #ddd',
        borderRadius: 8,
        cursor: disabled ? 'not-allowed' : 'pointer',
        overflow: 'hidden',
        background: 'transparent',
        opacity: disabled ? 0.5 : 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <img
        src={preset.imageUrl}
        alt={preset.label}
        style={{
          width: '100%',
          aspectRatio: '4/3',
          objectFit: 'cover',
          display: 'block',
        }}
      />
      <span
        style={{
          fontSize: 12,
          padding: '4px 0',
          color: '#333',
        }}
      >
        {preset.label}
      </span>
    </button>
  );
}

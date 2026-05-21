import type { CSSProperties } from 'react';

type Props = {
  onClick: () => void;
  label?: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  style?: CSSProperties;
};

export function ChangeImageButton({
  onClick,
  label = 'Change image',
  disabled = false,
  variant = 'primary',
  style,
}: Props) {
  const isPrimary = variant === 'primary';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        border: isPrimary ? '1px solid #cfcfcf' : '1px solid #ddd',
        borderRadius: 8,
        padding: '6px 12px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: 14,
        fontWeight: isPrimary ? 600 : 400,
        background: isPrimary ? '#f5f5f5' : 'transparent',
        color: 'inherit',
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
    >
      {label}
    </button>
  );
}

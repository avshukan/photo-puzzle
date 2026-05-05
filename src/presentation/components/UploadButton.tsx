import { type CSSProperties, useRef } from 'react';

type Props = {
  onUpload: (file: File) => void;
  label?: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  style?: CSSProperties;
};

export function UploadButton({
  onUpload,
  label = 'Upload image',
  disabled = false,
  variant = 'secondary',
  style,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isPrimary = variant === 'primary';

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    onUpload(file);

    e.currentTarget.value = '';
  };

  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
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

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        aria-label="Upload image input"
        onChange={handleChange}
        style={{ display: 'none' }}
      />
    </>
  );
}

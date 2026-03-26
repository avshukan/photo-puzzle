import { useRef } from 'react';

type Props = {
  onUpload: (file: File) => void;
  label?: string;
};

export function UploadButton({ onUpload, label = 'Upload image' }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];

    console.log('File selected:', file);

    if (!file) return;

    console.log('Calling onUpload with file:', file);

    onUpload(file);

    e.currentTarget.value = '';
  };

  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        style={{
          border: '1px solid #ddd',
          borderRadius: 8,
          padding: '6px 10px',
          cursor: 'pointer',
          fontSize: 14,
          background: 'transparent',
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

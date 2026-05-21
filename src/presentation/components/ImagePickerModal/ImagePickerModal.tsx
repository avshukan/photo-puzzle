import { useCallback, useEffect } from 'react';
import type { PresetImage } from '../../../application';
import { UploadButton } from '../UploadButton';

type Props = {
  presets: PresetImage[];
  onSelectPreset: (preset: PresetImage) => void;
  onUpload: (file: File) => void;
  onClose: () => void;
  disabled?: boolean;
};

export function ImagePickerModal({
  presets,
  onSelectPreset,
  onUpload,
  onClose,
  disabled = false,
}: Props) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleUpload = (file: File) => {
    onUpload(file);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Choose image"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        zIndex: 100,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: 'min(480px, 100%)',
          background: '#fff',
          borderRadius: 12,
          padding: 16,
          border: '1px solid #e5e5e5',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
          Choose image
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 8,
            marginBottom: 16,
          }}
        >
          {presets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              disabled={disabled}
              onClick={() => {
                onSelectPreset(preset);
                onClose();
              }}
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
          ))}
        </div>

        <div
          style={{
            borderTop: '1px solid #eee',
            paddingTop: 12,
            display: 'flex',
            gap: 8,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <UploadButton
            onUpload={handleUpload}
            label="Upload your photo"
            disabled={disabled}
            variant="primary"
          />

          <button
            type="button"
            onClick={onClose}
            style={{
              border: '1px solid #ddd',
              borderRadius: 8,
              padding: '6px 12px',
              cursor: 'pointer',
              fontSize: 14,
              background: 'transparent',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

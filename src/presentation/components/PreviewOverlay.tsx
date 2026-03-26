import { useEffect } from 'react';

type Props = {
  imageUrl: string;
  onClose: () => void;
  boardWidth?: number;
  boardHeight?: number;
};

export function PreviewOverlay({
  imageUrl,
  onClose,
  boardWidth,
  boardHeight,
}: Props) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);

    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Preview original image"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        zIndex: 10,
      }}
      onClick={onClose}
    >
      <img
        src={imageUrl}
        alt="Original puzzle image"
        style={{
          width: boardWidth,
          height: boardHeight,
          maxWidth: boardWidth ?? '90vw',
          maxHeight: boardHeight ?? '90vh',
          borderRadius: 8,
          boxShadow: '0 4px 32px rgba(0,0,0,0.5)',
        }}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

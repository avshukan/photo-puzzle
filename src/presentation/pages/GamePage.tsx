import { useCallback, useEffect, useState } from 'react';
import type { Game } from '../../application';
import { useCases, ports } from '../../app/compositionRoot';
import { PuzzleBoard } from '../components/PuzzleBoard';
import { PreviewOverlay } from '../components/PreviewOverlay';
import { UI_CONFIG } from '../config/ui';

export function GamePage() {
  const [fileName, setFileName] = useState<string>('');

  const [isModalOpen, setIsModalOpen] = useState(true);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [game, setGame] = useState<Game | null>(() =>
    useCases.startGame.execute({ kind: 'default' }),
  );

  // revoke blob urls on unmount
  useEffect(() => {
    return () => {
      if (game?.imageUrl?.startsWith('blob:')) {
        ports.imageUrlPort.revokeObjectUrl(game.imageUrl);
      }
    };
  }, [game?.imageUrl]);

  const closeModal = useCallback(() => setIsModalOpen(false), []);

  useEffect(() => {
    if (!isModalOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };

    window.addEventListener('keydown', onKeyDown);

    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isModalOpen, closeModal]);

  const onUpload: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setFileName(file.name);

    setGame(() => useCases.startGame.execute({ kind: 'upload', file }));

    setIsModalOpen(true);

    // allow re-upload same file
    e.currentTarget.value = '';
  };

  const onTileClick = (fromIndex: number) => {
    setGame((prev) =>
      prev ? useCases.moveTile.execute(prev, fromIndex) : prev,
    );
  };

  if (!game) return null;

  return (
    <div
      style={{
        padding: 16,
        maxWidth: UI_CONFIG.BOARD.MAX_WIDTH,
        margin: '0 auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 12,
          alignItems: 'center',
        }}
      >
        <h1 style={{ margin: 0, fontSize: 20 }}>Photo Puzzle</h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Preview button */}
          <button
            type="button"
            aria-label="Preview original image"
            onClick={() => setIsPreviewOpen(true)}
            style={{
              border: '1px solid #ddd',
              borderRadius: 8,
              padding: '6px 10px',
              cursor: 'pointer',
              fontSize: 14,
              background: 'transparent',
            }}
          >
            Preview
          </button>

          {/* Upload */}
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="file"
              accept="image/*"
              onChange={onUpload}
              style={{ display: 'none' }}
            />
            <span
              style={{
                border: '1px solid #ddd',
                borderRadius: 8,
                padding: '6px 10px',
                cursor: 'pointer',
                fontSize: 14,
              }}
            >
              Choose file
            </span>
            <span style={{ fontSize: 12, opacity: 0.7 }}>
              {fileName || 'No file chosen'}
            </span>
          </label>
        </div>
      </div>

      <div style={{ height: 12 }} />

      <PuzzleBoard
        width={game.puzzle.width}
        height={game.puzzle.height}
        tiles={game.puzzle.tiles}
        imageUrl={game.imageUrl}
        onTileClick={onTileClick}
      />

      {isPreviewOpen && (
        <PreviewOverlay
          imageUrl={game.imageUrl}
          onClose={() => setIsPreviewOpen(false)}
        />
      )}

      {game.status === 'won' && isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Победа"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
          onClick={closeModal}
        >
          <div
            style={{
              width: 'min(420px, 100%)',
              background: '#fff',
              borderRadius: 12,
              padding: 16,
              border: '1px solid #e5e5e5',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: 18, fontWeight: 600 }}>Победа 🎉</div>
            <div style={{ height: 8 }} />
            <div style={{ fontSize: 14, opacity: 0.8 }}>
              Вы можете закрыть окно или загрузить новое изображение.
            </div>
            <div style={{ height: 12 }} />

            {/* Upload in modal */}
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="file"
                accept="image/*"
                onChange={onUpload}
                style={{ display: 'none' }}
              />
              <span
                style={{
                  border: '1px solid #ddd',
                  borderRadius: 8,
                  padding: '6px 10px',
                  cursor: 'pointer',
                  fontSize: 14,
                }}
              >
                Choose file
              </span>
              <span style={{ fontSize: 12, opacity: 0.7 }}>
                {fileName || 'No file chosen'}
              </span>
            </label>

            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button
                autoFocus
                type="button"
                onClick={closeModal}
                style={{
                  padding: '6px 10px',
                  borderRadius: 8,
                  border: '1px solid #ddd',
                  cursor: 'pointer',
                }}
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

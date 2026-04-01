import { useCallback, useEffect, useState } from 'react';
import type { Game } from '../../application';
import { gameService } from '../../app/compositionRoot';
import { PuzzleBoard } from '../components/PuzzleBoard';
import { PreviewOverlay } from '../components/PreviewOverlay';
import { UploadButton } from '../components/UploadButton';
import { APP_CONFIG } from '../../app/config/app';

export function GamePage() {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [tileSize, setTileSize] = useState(APP_CONFIG.TILE.DEFAULT_SIZE);
  const [game, setGame] = useState<Game | null>(() => gameService.init());
  const [error, setError] = useState<string | null>(null);

  const closeModal = useCallback(() => setIsModalOpen(false), []);

  useEffect(() => {
    if (!isModalOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };

    window.addEventListener('keydown', onKeyDown);

    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isModalOpen, closeModal]);

  const handleUpload = async (file: File) => {
    try {
      const next = await gameService.startWithUpload(file);

      setGame(next);

      setError(null);

      setIsModalOpen(true);

      setIsPreviewOpen(false);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('Unexpected error');
      }
    }
  };

  const onTileClick = (fromIndex: number) => {
    setGame((prev) => (prev ? gameService.move(prev, fromIndex) : prev));
  };

  if (!game) return null;

  return (
    <div
      style={{
        padding: 16,
        maxWidth: APP_CONFIG.BOARD.MAX_WIDTH,
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 12,
          alignItems: 'center',
        }}
      >
        <h1 style={{ margin: 0, fontSize: 20 }}>Photo Puzzle</h1>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
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

          <UploadButton onUpload={handleUpload} />
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div
          style={{
            marginTop: 12,
            padding: '8px 12px',
            borderRadius: 8,
            background: '#ffeaea',
            border: '1px solid #ffbdbd',
            color: '#b00020',
            fontSize: 14,
          }}
        >
          {error}
        </div>
      )}

      <div style={{ height: 12 }} />

      <PuzzleBoard
        width={game.puzzle.width}
        height={game.puzzle.height}
        tiles={game.puzzle.tiles}
        imageUrl={game.imageUrl}
        onTileClick={onTileClick}
        onTileSizeChange={setTileSize}
      />

      {/* Preview */}
      {isPreviewOpen && (
        <PreviewOverlay
          imageUrl={game.imageUrl}
          onClose={() => setIsPreviewOpen(false)}
          boardWidth={
            game.puzzle.width * tileSize +
            (game.puzzle.width - 1) * APP_CONFIG.BOARD.GAP_PX
          }
          boardHeight={
            game.puzzle.height * tileSize +
            (game.puzzle.height - 1) * APP_CONFIG.BOARD.GAP_PX
          }
        />
      )}

      {/* Victory modal */}
      {game.status === 'won' && isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Victory"
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
            <div style={{ fontSize: 18, fontWeight: 600 }}>Victory 🎉</div>

            <div style={{ height: 8 }} />

            <div style={{ fontSize: 14, opacity: 0.8 }}>
              You can close this window or upload a new image.
            </div>

            <div style={{ height: 12 }} />

            <div style={{ display: 'flex', gap: 8 }}>
              <UploadButton onUpload={handleUpload} label="Upload new" />

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
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

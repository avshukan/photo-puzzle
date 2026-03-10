import { useEffect, useRef, useState } from 'react';
import type { Game } from '../../application';
import { useCases, ports } from '../../app/compositionRoot';
import { PuzzleBoard } from '../components/PuzzleBoard';

export function GamePage() {
  const [fileName, setFileName] = useState<string>('');
  const uploadRef = useRef<HTMLInputElement>(null);
  const uploadWinRef = useRef<HTMLInputElement>(null);

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

  const onUpload: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setFileName(file.name);

    setGame(() => useCases.startGame.execute({ kind: 'upload', file }));

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
    <div style={{ padding: 16, maxWidth: 520, margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 12,
          alignItems: 'center',
        }}
      >
        <h1 style={{ margin: 0, fontSize: 20 }}>Photo Puzzle</h1>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            ref={uploadRef}
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
            onClick={() => uploadRef.current?.click()}
          >
            Choose file
          </span>
          <span style={{ fontSize: 12, opacity: 0.7 }}>
            {fileName || 'No file chosen'}
          </span>
        </label>
      </div>

      <div style={{ height: 12 }} />

      <PuzzleBoard
        width={game.puzzle.width}
        height={game.puzzle.height}
        tiles={game.puzzle.tiles}
        imageUrl={game.imageUrl}
        onTileClick={onTileClick}
      />

      {game.status === 'won' && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
        >
          <div
            style={{
              width: 'min(420px, 100%)',
              background: '#fff',
              borderRadius: 12,
              padding: 16,
              border: '1px solid #e5e5e5',
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 600 }}>Победа 🎉</div>
            <div style={{ height: 8 }} />
            <div style={{ fontSize: 14, opacity: 0.8 }}>
              Загрузите новое изображение, чтобы сыграть ещё раз.
            </div>
            <div style={{ height: 12 }} />
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                ref={uploadWinRef}
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
                onClick={() => uploadWinRef.current?.click()}
              >
                Choose file
              </span>
              <span style={{ fontSize: 12, opacity: 0.7 }}>
                {fileName || 'No file chosen'}
              </span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}

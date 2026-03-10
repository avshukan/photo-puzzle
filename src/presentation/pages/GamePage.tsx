import { useEffect, useState } from 'react';
import type { Game } from '../../application';
import { useCases, ports } from '../../app/compositionRoot';
import { PuzzleBoard } from '../components/PuzzleBoard';

export function GamePage() {
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

    setGame((prev) => {
      if (prev?.imageUrl?.startsWith('blob:')) {
        ports.imageUrlPort.revokeObjectUrl(prev.imageUrl);
      }
      return useCases.startGame.execute({ kind: 'upload', file });
    });

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
        <label style={{ fontSize: 14 }}>
          <span style={{ display: 'none' }}>file</span>
          <input type="file" accept="image/*" onChange={onUpload} />
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
            marginTop: 12,
            padding: 12,
            border: '1px solid #ddd',
            borderRadius: 8,
          }}
        >
          Победа 🎉
        </div>
      )}
    </div>
  );
}

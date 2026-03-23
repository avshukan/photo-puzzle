import { useEffect, useRef, useState } from 'react';
import { canMove } from '../../domain';
import { UI_CONFIG } from '../config/ui';

type Props = {
  width: number;
  height: number;
  tiles: readonly number[];
  imageUrl: string;
  onTileClick: (fromIndex: number) => void;
};

export function PuzzleBoard({
  width,
  height,
  tiles,
  imageUrl,
  onTileClick,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [tileSize, setTileSize] = useState(UI_CONFIG.TILE.DEFAULT_SIZE);

  const GAP_PX = UI_CONFIG.BOARD.GAP_PX;

  useEffect(() => {
    function updateSize() {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.clientWidth;
      const gaps = (width - 1) * GAP_PX;

      let size = Math.floor((containerWidth - gaps) / width);

      // clamp
      size = Math.max(UI_CONFIG.TILE.MIN_SIZE, size);
      size = Math.min(UI_CONFIG.TILE.MAX_SIZE, size);

      setTileSize(size);
    }

    updateSize();

    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [width, GAP_PX]);

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${width}, ${tileSize}px)`,
          gridTemplateRows: `repeat(${height}, ${tileSize}px)`,
          gap: GAP_PX,
          userSelect: 'none',
          justifyContent: 'center',
        }}
      >
        {tiles.map((tile, index) => {
          if (tile === 0) {
            return (
              <div
                key={`empty-${index}`}
                style={{
                  background: '#f2f2f2',
                  border: '1px solid #e5e5e5',
                  borderRadius: 8,
                }}
              />
            );
          }

          const tileIndex = tile - 1;
          const srcRow = Math.floor(tileIndex / width);
          const srcCol = tileIndex % width;

          const movable = canMove({ width, height, tiles }, index);

          return (
            <button
              key={tile}
              onClick={() => onTileClick(index)}
              disabled={!movable}
              style={{
                border: '1px solid #e5e5e5',
                borderRadius: 8,
                padding: 0,
                cursor: movable ? 'pointer' : 'not-allowed',
                backgroundImage: `url(${imageUrl})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: `${width * tileSize}px ${height * tileSize}px`,
                backgroundPosition: `${-srcCol * tileSize}px ${-srcRow * tileSize}px`,
              }}
              aria-label={`Tile ${tile}`}
            />
          );
        })}
      </div>
    </div>
  );
}

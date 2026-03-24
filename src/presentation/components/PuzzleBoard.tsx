import { useLayoutEffect, useRef, useState } from 'react';
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

  useLayoutEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const computeSize = (containerWidth: number) => {
      const gaps = (width - 1) * UI_CONFIG.BOARD.GAP_PX;
      const raw = Math.floor((containerWidth - gaps) / width);
      return Math.min(
        UI_CONFIG.TILE.MAX_SIZE,
        Math.max(UI_CONFIG.TILE.MIN_SIZE, raw),
      );
    };

    setTileSize(computeSize(container.getBoundingClientRect().width));

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];

      if (!entry) return;

      setTileSize((prev) => {
        const size = computeSize(entry.contentRect.width);
        return prev === size ? prev : size;
      });
    });

    observer.observe(container);

    return () => observer.disconnect();
  }, [width]);

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${width}, ${tileSize}px)`,
          gridTemplateRows: `repeat(${height}, ${tileSize}px)`,
          gap: UI_CONFIG.BOARD.GAP_PX,
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

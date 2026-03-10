type Props = {
  width: number;
  height: number;
  tiles: readonly number[];
  imageUrl: string;
  onTileClick: (fromIndex: number) => void;
};

// MVP: фикс 4x4. Но компонент уже поддерживает прямоугольник.
const TILE_PX = 96;
const GAP_PX = 2;

export function PuzzleBoard({
  width,
  height,
  tiles,
  imageUrl,
  onTileClick,
}: Props) {
  const boardW = width * TILE_PX + (width - 1) * GAP_PX;
  const boardH = height * TILE_PX + (height - 1) * GAP_PX;

  return (
    <div
      style={{
        width: boardW,
        height: boardH,
        display: 'grid',
        gridTemplateColumns: `repeat(${width}, ${TILE_PX}px)`,
        gridTemplateRows: `repeat(${height}, ${TILE_PX}px)`,
        gap: GAP_PX,
        userSelect: 'none',
      }}
    >
      {tiles.map((tile, index) => {
        if (tile === 0) {
          return (
            <div
              key="empty"
              style={{
                background: '#f2f2f2',
                border: '1px solid #e5e5e5',
                borderRadius: 8,
              }}
            />
          );
        }

        const tileIndex = tile - 1; // 0..N-2
        const srcRow = Math.floor(tileIndex / width);
        const srcCol = tileIndex % width;

        return (
          <button
            key={tile}
            onClick={() => onTileClick(index)}
            style={{
              border: '1px solid #e5e5e5',
              borderRadius: 8,
              padding: 0,
              cursor: 'pointer',
              backgroundImage: `url(${imageUrl})`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: `${width * TILE_PX}px ${height * TILE_PX}px`,
              backgroundPosition: `${-srcCol * TILE_PX}px ${-srcRow * TILE_PX}px`,
            }}
            aria-label={`Tile ${tile}`}
          />
        );
      })}
    </div>
  );
}

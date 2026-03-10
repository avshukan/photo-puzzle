import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PuzzleBoard } from './PuzzleBoard';

describe('PuzzleBoard', () => {
  it('calls onTileClick with index', async () => {
    const onTileClick = vi.fn();
    const tiles = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 0, 15,
    ] as const;

    render(
      <PuzzleBoard
        width={4}
        height={4}
        tiles={tiles}
        imageUrl="img"
        onTileClick={onTileClick}
      />,
    );

    await userEvent.click(screen.getByLabelText('Tile 15'));
    expect(onTileClick).toHaveBeenCalledWith(15);
  });
});

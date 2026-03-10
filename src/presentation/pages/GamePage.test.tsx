import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { Game } from '../../application';

vi.mock('../../app/compositionRoot', () => {
  const game: Game = {
    imageUrl: 'default',
    puzzle: {
      width: 4,
      height: 4,
      tiles: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0],
    },
    status: 'playing',
  };

  return {
    useCases: {
      startGame: { execute: vi.fn(() => game) },
      moveTile: { execute: vi.fn(() => game) },
    },
    ports: {
      imageUrlPort: { revokeObjectUrl: vi.fn() },
    },
  };
});

import { GamePage } from './GamePage';
import { useCases } from '../../app/compositionRoot';
import userEvent from '@testing-library/user-event';

describe('GamePage', () => {
  it('starts with default game on mount', async () => {
    render(<GamePage />);

    expect(useCases.startGame.execute).toHaveBeenCalledWith({
      kind: 'default',
    });

    expect(await screen.findByLabelText('Tile 1')).toBeInTheDocument();
  });

  it('starts game from uploaded file', async () => {
    render(<GamePage />);

    const input = screen.getByLabelText(/file/i) as HTMLInputElement;
    const file = new File(['x'], 'photo.png', { type: 'image/png' });

    await userEvent.upload(input, file);

    expect(useCases.startGame.execute).toHaveBeenLastCalledWith({
      kind: 'upload',
      file,
    });
  });
});

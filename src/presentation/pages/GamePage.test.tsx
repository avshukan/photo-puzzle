import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { Game } from '../../application';
import { GamePage } from './GamePage';
import { gameService } from '../../app/compositionRoot';
import userEvent from '@testing-library/user-event';

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
    gameService: {
      init: vi.fn(() => game),
      startWithUpload: vi.fn(() => Promise.resolve(game)),
      move: vi.fn(() => game),
      reset: vi.fn(),
    },
  };
});

describe('GamePage', () => {
  it('starts with default game on mount', async () => {
    render(<GamePage />);

    expect(gameService.init).toHaveBeenCalled();

    expect(await screen.findByLabelText('Tile 1')).toBeInTheDocument();
  });

  it('starts game from uploaded file', async () => {
    render(<GamePage />);

    const input = screen.getByLabelText(
      /upload image input/i,
    ) as HTMLInputElement;

    const file = new File(['x'], 'photo.png', { type: 'image/png' });

    await userEvent.upload(input, file);

    expect(gameService.startWithUpload).toHaveBeenLastCalledWith(file);
  });

  it('shows preview overlay when Preview button is clicked', async () => {
    render(<GamePage />);

    expect(
      screen.queryByRole('dialog', { name: 'Preview' }),
    ).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Preview' }));

    expect(screen.getByRole('dialog', { name: 'Preview' })).toBeInTheDocument();

    expect(screen.getByAltText('Original puzzle image')).toBeInTheDocument();
  });
});

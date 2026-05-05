import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GamePage } from './GamePage';
import { gameService } from '../../app/compositionRoot';

// --- mocks ---
vi.mock('../../app/compositionRoot', () => ({
  gameService: {
    init: vi.fn(),
    startWithUpload: vi.fn(),
    move: vi.fn(),
    shuffle: vi.fn(),
  },
}));
// --- helpers ---
const mockGame = {
  puzzle: {
    width: 4,
    height: 4,
    tiles: Array.from({ length: 16 }, (_, i) => i),
  },
  imageUrl: 'data:image/jpeg;base64,test',
  status: 'playing',
};

const mockWonGame = {
  ...mockGame,
  status: 'won',
};

// --- tests ---

describe('GamePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    gameService.init = vi.fn().mockReturnValue(mockGame);
  });

  it('renders without crashing', () => {
    render(<GamePage />);

    expect(screen.getByText('Photo Puzzle')).toBeInTheDocument();
  });

  it('shows error message when upload fails', async () => {
    const errorMessage = 'File is too large';

    gameService.startWithUpload = vi
      .fn()
      .mockRejectedValue(new Error(errorMessage));

    render(<GamePage />);

    const file = new File(['x'], 'test.jpg', { type: 'image/jpeg' });

    fireEvent.change(
      screen.getByLabelText(/upload image input/i) as HTMLInputElement,
      { target: { files: [file] } },
    );

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('shows upload error inside victory modal when modal upload fails', async () => {
    const errorMessage = 'File is too large';

    gameService.init = vi.fn().mockReturnValue(mockWonGame);
    gameService.startWithUpload = vi
      .fn()
      .mockRejectedValue(new Error(errorMessage));

    render(<GamePage />);

    const file = new File(['x'], 'test.jpg', { type: 'image/jpeg' });
    const dialog = screen.getByRole('dialog', { name: /victory/i });
    const modalInput = within(dialog).getByLabelText(
      /upload image input/i,
    ) as HTMLInputElement;

    fireEvent.change(modalInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(within(dialog).getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('clears error after successful upload', async () => {
    gameService.startWithUpload = vi
      .fn()
      .mockRejectedValueOnce(new Error('error'))
      .mockResolvedValueOnce({ game: mockGame, persisted: true });

    render(<GamePage />);

    const file = new File(['x'], 'test.jpg', { type: 'image/jpeg' });

    const input = screen.getByLabelText(
      /upload image input/i,
    ) as HTMLInputElement;

    // first → error
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText('error')).toBeInTheDocument();
    });

    // second → success
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.queryByText('error')).not.toBeInTheDocument();
    });
  });

  it('shows warning when image cannot be persisted', async () => {
    gameService.startWithUpload = vi
      .fn()
      .mockResolvedValue({ game: mockGame, persisted: false });

    render(<GamePage />);

    const file = new File(['x'], 'test.jpg', { type: 'image/jpeg' });

    fireEvent.change(
      screen.getByLabelText(/upload image input/i) as HTMLInputElement,
      { target: { files: [file] } },
    );

    await waitFor(() => {
      expect(
        screen.getByText(
          'Image is too large to save. It will not persist after reload.',
        ),
      ).toBeInTheDocument();
    });
  });

  it('clears warning after next successful upload with persistence', async () => {
    gameService.startWithUpload = vi
      .fn()
      .mockResolvedValueOnce({ game: mockGame, persisted: false })
      .mockResolvedValueOnce({ game: mockGame, persisted: true });

    render(<GamePage />);

    const file = new File(['x'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText(
      /upload image input/i,
    ) as HTMLInputElement;

    // first → warning
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(
        screen.getByText(
          'Image is too large to save. It will not persist after reload.',
        ),
      ).toBeInTheDocument();
    });

    // second → success, warning clears
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(
        screen.queryByText(
          'Image is too large to save. It will not persist after reload.',
        ),
      ).not.toBeInTheDocument();
    });
  });

  it('Shuffle button is visible and calls gameService.shuffle with current game', () => {
    const shuffledGame = { ...mockGame, puzzle: { ...mockGame.puzzle, tiles: Array.from({ length: 16 }, (_, i) => (i + 1) % 16) } };

    gameService.shuffle = vi.fn().mockReturnValue(shuffledGame);

    render(<GamePage />);

    const shuffleButton = screen.getByRole('button', { name: /shuffle/i });
    expect(shuffleButton).toBeInTheDocument();

    fireEvent.click(shuffleButton);

    expect(gameService.shuffle).toHaveBeenCalledWith(mockGame);
  });

  it('Shuffle button in victory modal closes the modal and reshuffles', () => {
    gameService.init = vi.fn().mockReturnValue(mockWonGame);

    const reshuffledGame = { ...mockGame, status: 'playing' };
    gameService.shuffle = vi.fn().mockReturnValue(reshuffledGame);

    render(<GamePage />);

    const dialog = screen.getByRole('dialog', { name: /victory/i });
    expect(dialog).toBeInTheDocument();

    const shuffleInModal = within(dialog).getByRole('button', { name: /shuffle/i });
    fireEvent.click(shuffleInModal);

    expect(gameService.shuffle).toHaveBeenCalledWith(mockWonGame);
    expect(screen.queryByRole('dialog', { name: /victory/i })).not.toBeInTheDocument();
  });
});

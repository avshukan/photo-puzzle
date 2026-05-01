import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GamePage } from './GamePage';
import { gameService } from '../../app/compositionRoot';

// --- mocks ---
vi.mock('../../app/compositionRoot', () => ({
  gameService: {
    init: vi.fn(),
    startWithUpload: vi.fn(),
    move: vi.fn(),
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

    // UploadButton likely wraps input → trigger via click simulation
    fireEvent.change(
      document.querySelector('input[type="file"]') as HTMLInputElement,
      {
        target: { files: [file] },
      },
    );

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('clears error after successful upload', async () => {
    gameService.startWithUpload = vi
      .fn()
      .mockRejectedValueOnce(new Error('error'))
      .mockResolvedValueOnce({ game: mockGame, persisted: true });

    render(<GamePage />);

    const file = new File(['x'], 'test.jpg', { type: 'image/jpeg' });

    const input = document.querySelector(
      'input[type="file"]',
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
      document.querySelector('input[type="file"]') as HTMLInputElement,
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
    const input = document.querySelector(
      'input[type="file"]',
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
});

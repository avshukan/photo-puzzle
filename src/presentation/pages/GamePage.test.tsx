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
    startWithPreset: vi.fn(),
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

    // Open the image picker modal
    fireEvent.click(screen.getByRole('button', { name: /change image/i }));

    const file = new File(['x'], 'test.jpg', { type: 'image/jpeg' });

    fireEvent.change(
      screen.getByLabelText(/upload image input/i) as HTMLInputElement,
      { target: { files: [file] } },
    );

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      // Picker should be closed so the error is visible
      expect(
        screen.queryByRole('dialog', { name: /choose image/i }),
      ).not.toBeInTheDocument();
    });
  });

  it('shows upload error inside victory modal when modal upload fails', async () => {
    const errorMessage = 'File is too large';

    gameService.init = vi.fn().mockReturnValue(mockWonGame);
    gameService.startWithUpload = vi
      .fn()
      .mockRejectedValue(new Error(errorMessage));

    render(<GamePage />);

    const dialog = screen.getByRole('dialog', { name: /victory/i });

    // Click "Change image" inside victory modal to open picker
    fireEvent.click(
      within(dialog).getByRole('button', { name: /change image/i }),
    );

    const pickerDialog = screen.getByRole('dialog', { name: /choose image/i });
    const modalInput = within(pickerDialog).getByLabelText(
      /upload image input/i,
    ) as HTMLInputElement;

    const file = new File(['x'], 'test.jpg', { type: 'image/jpeg' });
    fireEvent.change(modalInput, { target: { files: [file] } });

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

    // Open picker and upload (first → error)
    fireEvent.click(screen.getByRole('button', { name: /change image/i }));
    const input = screen.getByLabelText(
      /upload image input/i,
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText('error')).toBeInTheDocument();
    });

    // Open picker again and upload (second → success)
    fireEvent.click(screen.getByRole('button', { name: /change image/i }));
    const input2 = screen.getByLabelText(
      /upload image input/i,
    ) as HTMLInputElement;
    fireEvent.change(input2, { target: { files: [file] } });

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

    fireEvent.click(screen.getByRole('button', { name: /change image/i }));
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

    // first → warning
    fireEvent.click(screen.getByRole('button', { name: /change image/i }));
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

    // second → success, warning clears
    fireEvent.click(screen.getByRole('button', { name: /change image/i }));
    fireEvent.change(
      screen.getByLabelText(/upload image input/i) as HTMLInputElement,
      { target: { files: [file] } },
    );

    await waitFor(() => {
      expect(
        screen.queryByText(
          'Image is too large to save. It will not persist after reload.',
        ),
      ).not.toBeInTheDocument();
    });
  });

  it('Shuffle button is visible and calls gameService.shuffle with current game', () => {
    const shuffledGame = {
      ...mockGame,
      puzzle: {
        ...mockGame.puzzle,
        tiles: Array.from({ length: 16 }, (_, i) => (i + 1) % 16),
      },
    };

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

    const shuffleInModal = within(dialog).getByRole('button', {
      name: /shuffle/i,
    });
    fireEvent.click(shuffleInModal);

    expect(gameService.shuffle).toHaveBeenCalledWith(mockWonGame);
    expect(
      screen.queryByRole('dialog', { name: /victory/i }),
    ).not.toBeInTheDocument();
  });

  it('Change image button opens picker modal', () => {
    render(<GamePage />);

    expect(
      screen.queryByRole('dialog', { name: /choose image/i }),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /change image/i }));

    expect(
      screen.getByRole('dialog', { name: /choose image/i }),
    ).toBeInTheDocument();
  });

  it('selecting a preset calls gameService.startWithPreset and closes picker', () => {
    gameService.startWithPreset = vi.fn().mockReturnValue(mockGame);

    render(<GamePage />);

    fireEvent.click(screen.getByRole('button', { name: /change image/i }));

    const picker = screen.getByRole('dialog', { name: /choose image/i });
    const firstPreset = within(picker).getAllByRole('button')[0];
    fireEvent.click(firstPreset);

    expect(gameService.startWithPreset).toHaveBeenCalledTimes(1);
    expect(
      screen.queryByRole('dialog', { name: /choose image/i }),
    ).not.toBeInTheDocument();
  });
});

import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PreviewOverlay } from './PreviewOverlay';

describe('PreviewOverlay', () => {
  it('renders the original image and dialog', () => {
    render(<PreviewOverlay imageUrl="test-image.jpg" onClose={vi.fn()} />);

    expect(
      screen.getByRole('dialog', { name: 'Preview original image' }),
    ).toBeInTheDocument();

    expect(screen.getByAltText('Original puzzle image')).toHaveAttribute(
      'src',
      'test-image.jpg',
    );
  });

  it('calls onClose when backdrop is clicked', async () => {
    const onClose = vi.fn();

    render(<PreviewOverlay imageUrl="test-image.jpg" onClose={onClose} />);

    await userEvent.click(
      screen.getByRole('dialog', { name: 'Preview original image' }),
    );

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when image is clicked', async () => {
    const onClose = vi.fn();

    render(<PreviewOverlay imageUrl="test-image.jpg" onClose={onClose} />);

    await userEvent.click(screen.getByAltText('Original puzzle image'));

    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose when Escape key is pressed', async () => {
    const onClose = vi.fn();

    render(<PreviewOverlay imageUrl="test-image.jpg" onClose={onClose} />);

    await userEvent.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when not Escape key is pressed', async () => {
    const onClose = vi.fn();

    render(<PreviewOverlay imageUrl="test-image.jpg" onClose={onClose} />);

    await userEvent.keyboard('{Enter}');

    expect(onClose).toHaveBeenCalledTimes(0);
  });

  it('applies board dimensions to the image when provided', () => {
    render(
      <PreviewOverlay
        imageUrl="test-image.jpg"
        onClose={vi.fn()}
        boardWidth={292}
        boardHeight={292}
      />,
    );

    const img = screen.getByAltText('Original puzzle image');

    expect(img).toHaveStyle({ width: '292px', height: '292px' });
  });
});

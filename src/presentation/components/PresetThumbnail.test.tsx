import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PresetThumbnail } from './PresetThumbnail';
import type { PresetImage } from '../../application';

const preset: PresetImage = {
  id: 'preset-1',
  label: 'Forest',
  imageUrl: 'data:image/jpeg;base64,1',
};

describe('PresetThumbnail', () => {
  it('renders the preset label', () => {
    render(<PresetThumbnail preset={preset} onClick={vi.fn()} />);

    expect(screen.getByText('Forest')).toBeInTheDocument();
  });

  it('renders an image with the preset imageUrl as src and label as alt', () => {
    render(<PresetThumbnail preset={preset} onClick={vi.fn()} />);

    const img = screen.getByRole('img', { name: /forest/i });
    expect(img).toHaveAttribute('src', preset.imageUrl);
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();

    render(<PresetThumbnail preset={preset} onClick={onClick} />);

    fireEvent.click(screen.getByRole('button'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled=true', () => {
    render(<PresetThumbnail preset={preset} onClick={vi.fn()} disabled />);

    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('does not call onClick when disabled', () => {
    const onClick = vi.fn();

    render(<PresetThumbnail preset={preset} onClick={onClick} disabled />);

    fireEvent.click(screen.getByRole('button'));

    expect(onClick).not.toHaveBeenCalled();
  });
});

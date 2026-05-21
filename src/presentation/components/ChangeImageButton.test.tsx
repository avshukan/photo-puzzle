import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ChangeImageButton } from './ChangeImageButton';

describe('ChangeImageButton', () => {
  it('renders with default label', () => {
    render(<ChangeImageButton onClick={vi.fn()} />);

    expect(
      screen.getByRole('button', { name: /change image/i }),
    ).toBeInTheDocument();
  });

  it('renders with a custom label', () => {
    render(<ChangeImageButton onClick={vi.fn()} label="Pick preset" />);

    expect(
      screen.getByRole('button', { name: /pick preset/i }),
    ).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();

    render(<ChangeImageButton onClick={onClick} />);

    fireEvent.click(screen.getByRole('button', { name: /change image/i }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled=true', () => {
    render(<ChangeImageButton onClick={vi.fn()} disabled />);

    expect(
      screen.getByRole('button', { name: /change image/i }),
    ).toBeDisabled();
  });

  it('does not call onClick when disabled', () => {
    const onClick = vi.fn();

    render(<ChangeImageButton onClick={onClick} disabled />);

    fireEvent.click(screen.getByRole('button', { name: /change image/i }));

    expect(onClick).not.toHaveBeenCalled();
  });
});

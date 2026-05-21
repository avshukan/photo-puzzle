import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ImagePickerModal } from './ImagePickerModal';
import type { PresetImage } from '../../../application';

const mockPresets: PresetImage[] = [
  { id: 'preset-0', label: 'Default', imageUrl: 'data:image/jpeg;base64,0' },
  { id: 'preset-1', label: 'Forest', imageUrl: 'data:image/jpeg;base64,1' },
  { id: 'preset-2', label: 'Lake', imageUrl: 'data:image/jpeg;base64,2' },
];

describe('ImagePickerModal', () => {
  it('renders preset thumbnails with labels', () => {
    render(
      <ImagePickerModal
        presets={mockPresets}
        onSelectPreset={vi.fn()}
        onUpload={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByText('Default')).toBeInTheDocument();
    expect(screen.getByText('Forest')).toBeInTheDocument();
    expect(screen.getByText('Lake')).toBeInTheDocument();
  });

  it('renders "Choose image" dialog', () => {
    render(
      <ImagePickerModal
        presets={mockPresets}
        onSelectPreset={vi.fn()}
        onUpload={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    expect(
      screen.getByRole('dialog', { name: /choose image/i }),
    ).toBeInTheDocument();
  });

  it('calls onSelectPreset and onClose when a preset is clicked', () => {
    const onSelectPreset = vi.fn();
    const onClose = vi.fn();

    render(
      <ImagePickerModal
        presets={mockPresets}
        onSelectPreset={onSelectPreset}
        onUpload={vi.fn()}
        onClose={onClose}
      />,
    );

    const buttons = screen
      .getAllByRole('button')
      .filter((b) => b.querySelector('img'));

    fireEvent.click(buttons[1]);

    expect(onSelectPreset).toHaveBeenCalledWith(mockPresets[1]);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Cancel button is clicked', () => {
    const onClose = vi.fn();

    render(
      <ImagePickerModal
        presets={mockPresets}
        onSelectPreset={vi.fn()}
        onUpload={vi.fn()}
        onClose={onClose}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when clicking the backdrop', () => {
    const onClose = vi.fn();

    render(
      <ImagePickerModal
        presets={mockPresets}
        onSelectPreset={vi.fn()}
        onUpload={vi.fn()}
        onClose={onClose}
      />,
    );

    fireEvent.click(screen.getByRole('dialog', { name: /choose image/i }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape key is pressed', () => {
    const onClose = vi.fn();

    render(
      <ImagePickerModal
        presets={mockPresets}
        onSelectPreset={vi.fn()}
        onUpload={vi.fn()}
        onClose={onClose}
      />,
    );

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders upload button inside the modal', () => {
    render(
      <ImagePickerModal
        presets={mockPresets}
        onSelectPreset={vi.fn()}
        onUpload={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    expect(
      screen.getByRole('button', { name: /upload your photo/i }),
    ).toBeInTheDocument();
  });

  it('disables preset buttons and upload when disabled=true', () => {
    render(
      <ImagePickerModal
        presets={mockPresets}
        onSelectPreset={vi.fn()}
        onUpload={vi.fn()}
        onClose={vi.fn()}
        disabled
      />,
    );

    const presetButtons = screen
      .getAllByRole('button')
      .filter((b) => b.querySelector('img'));

    presetButtons.forEach((btn) => {
      expect(btn).toBeDisabled();
    });

    expect(
      screen.getByRole('button', { name: /upload your photo/i }),
    ).toBeDisabled();
  });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UploadButton } from './UploadButton';
import { describe, expect, test, vi } from 'vitest';

describe('UploadButton', () => {
  test('renders with default label', () => {
    render(<UploadButton onUpload={vi.fn()} />);

    expect(
      screen.getByRole('button', { name: /upload image/i }),
    ).toBeInTheDocument();
  });

  test('renders with custom label', () => {
    render(<UploadButton onUpload={vi.fn()} label="Upload new" />);

    expect(
      screen.getByRole('button', { name: /upload new/i }),
    ).toBeInTheDocument();
  });

  test('calls onUpload when file selected', async () => {
    const user = userEvent.setup();

    const onUpload = vi.fn();

    render(<UploadButton onUpload={onUpload} />);

    const file = new File(['test'], 'test.png', { type: 'image/png' });

    const input = screen.getByLabelText(/upload image input/i);

    await user.upload(input, file);

    expect(onUpload).toHaveBeenCalledTimes(1);

    expect(onUpload).toHaveBeenCalledWith(file);
  });

  test('can upload same file twice', async () => {
    const user = userEvent.setup();

    const onUpload = vi.fn();

    render(<UploadButton onUpload={onUpload} />);

    const file = new File(['test'], 'test.png', { type: 'image/png' });

    const input = screen.getByLabelText(/upload image input/i);

    await user.upload(input, file);

    await user.upload(input, file);

    expect(onUpload).toHaveBeenCalledTimes(2);
  });

  test('does nothing if no file selected', async () => {
    const user = userEvent.setup();

    const onUpload = vi.fn();

    render(<UploadButton onUpload={onUpload} />);

    const input = screen.getByLabelText(/upload image input/i);

    await user.upload(input, []);

    expect(onUpload).not.toHaveBeenCalled();
  });

  test('clicking button triggers file input click', async () => {
    const user = userEvent.setup();

    const onUpload = vi.fn();

    render(<UploadButton onUpload={onUpload} />);

    const button = screen.getByRole('button', { name: /upload image/i });

    const clickSpy = vi.spyOn(HTMLInputElement.prototype, 'click');

    await user.click(button);

    expect(clickSpy).toHaveBeenCalled();
  });
});

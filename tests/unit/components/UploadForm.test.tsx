import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UploadForm } from '../../../src/components/UploadForm';
import * as filesService from '../../../src/services/files.service';

vi.mock('../../../src/services/files.service', () => ({
  uploadFile: vi.fn(),
}));

const uploadFileMock = vi.mocked(filesService.uploadFile);

const fileDto = {
  id: '00000000-0000-4000-8000-000000000001',
  originalName: 'hello.txt',
  contentType: 'text/plain',
  size: 5,
  createdAt: '2026-01-01T00:00:00.000Z',
};

describe('UploadForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('requires a file before submitting', async () => {
    const user = userEvent.setup();
    render(<UploadForm onUploaded={() => {}} />);

    await user.click(screen.getByRole('button', { name: 'Upload' }));

    expect(await screen.findByText('Please choose a file')).toBeInTheDocument();
    expect(uploadFileMock).not.toHaveBeenCalled();
  });

  it('uploads a selected file and notifies the parent', async () => {
    const user = userEvent.setup();
    uploadFileMock.mockResolvedValue(fileDto);
    const onUploaded = vi.fn();

    render(<UploadForm onUploaded={onUploaded} />);

    const file = new File(['hello'], 'hello.txt', { type: 'text/plain' });
    await user.upload(screen.getByLabelText('Choose a file'), file);
    await user.click(screen.getByRole('button', { name: 'Upload' }));

    await waitFor(() => expect(onUploaded).toHaveBeenCalledTimes(1));
    expect(uploadFileMock).toHaveBeenCalledWith(file);
  });
});

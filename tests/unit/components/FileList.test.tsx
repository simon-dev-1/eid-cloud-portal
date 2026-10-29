import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FileList } from '../../../src/components/FileList';

import type { FileDto } from '../../../src/services/files.service';

const files: FileDto[] = [
  {
    id: '00000000-0000-4000-8000-000000000001',
    originalName: 'hello.txt',
    contentType: 'text/plain',
    size: 5,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: '00000000-0000-4000-8000-000000000002',
    originalName: 'report.pdf',
    contentType: 'application/pdf',
    size: 2048,
    createdAt: '2026-01-02T00:00:00.000Z',
  },
];

describe('FileList', () => {
  it('shows a loading message while loading', () => {
    render(<FileList files={[]} isLoading error={null} onDelete={() => {}} />);

    expect(screen.getByText('Loading…')).toBeInTheDocument();
  });

  it('shows the error message when present', () => {
    render(<FileList files={[]} isLoading={false} error="Something broke" onDelete={() => {}} />);

    expect(screen.getByText('Something broke')).toBeInTheDocument();
  });

  it('shows an empty state when there are no files', () => {
    render(<FileList files={[]} isLoading={false} error={null} onDelete={() => {}} />);

    expect(screen.getByText('No files yet. Upload one above.')).toBeInTheDocument();
  });

  it('renders file names with download links and formats sizes', () => {
    render(<FileList files={files} isLoading={false} error={null} onDelete={() => {}} />);

    expect(screen.getByText('hello.txt')).toHaveAttribute(
      'href',
      '/api/v1/files/00000000-0000-4000-8000-000000000001',
    );
    expect(screen.getByText('report.pdf')).toBeInTheDocument();
    expect(screen.getByText('2.0 KB')).toBeInTheDocument();
    expect(screen.getByText('5 B')).toBeInTheDocument();
  });

  it('calls onDelete with the file id when Delete is clicked', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    render(<FileList files={files} isLoading={false} error={null} onDelete={onDelete} />);

    await user.click(screen.getAllByRole('button', { name: 'Delete' })[0]);

    expect(onDelete).toHaveBeenCalledWith('00000000-0000-4000-8000-000000000001');
  });
});

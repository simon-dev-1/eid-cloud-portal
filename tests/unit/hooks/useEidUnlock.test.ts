import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useEidUnlock } from '../../../src/hooks/useEidUnlock';
import * as verificationsService from '../../../src/services/verifications.service';

vi.mock('../../../src/services/verifications.service', () => ({
  createVerification: vi.fn(),
  getVerification: vi.fn(),
}));

const createVerificationMock = vi.mocked(verificationsService.createVerification);
const getVerificationMock = vi.mocked(verificationsService.getVerification);

describe('useEidUnlock', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('creates a verification then unlocks on SUCCESS', async () => {
    createVerificationMock.mockResolvedValue({
      verificationId: 'vid',
      deeplink: 'swiyu-verify://?client_id=...',
    });
    getVerificationMock.mockResolvedValue({
      state: 'SUCCESS',
      vaultId: 'v',
      displayName: 'Max Muster',
      masterKey: 'k',
    });

    const { result } = renderHook(() => useEidUnlock());

    await act(async () => {
      await result.current.handlers.start();
    });

    expect(result.current.status).toBe('pending');
    expect(result.current.deeplink).toBe('swiyu-verify://?client_id=...');

    await act(async () => {
      await vi.advanceTimersByTimeAsync(2000);
    });

    expect(result.current.status).toBe('success');
    expect(result.current.result?.vaultId).toBe('v');
    expect(result.current.result?.displayName).toBe('Max Muster');
  });

  it('surfaces an error when the verification fails', async () => {
    createVerificationMock.mockResolvedValue({ verificationId: 'vid', deeplink: 'd' });
    getVerificationMock.mockResolvedValue({ state: 'FAILED', error: 'rejected' });

    const { result } = renderHook(() => useEidUnlock());

    await act(async () => {
      await result.current.handlers.start();
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(2000);
    });

    expect(result.current.status).toBe('error');
    expect(result.current.error).toBe('rejected');
  });

  it('resets back to idle', async () => {
    createVerificationMock.mockResolvedValue({ verificationId: 'vid', deeplink: 'd' });
    getVerificationMock.mockResolvedValue({ state: 'PENDING' });

    const { result } = renderHook(() => useEidUnlock());

    await act(async () => {
      await result.current.handlers.start();
    });
    expect(result.current.status).toBe('pending');

    act(() => result.current.handlers.reset());

    expect(result.current.status).toBe('idle');
    expect(result.current.deeplink).toBeNull();
    expect(result.current.error).toBeNull();
  });
});

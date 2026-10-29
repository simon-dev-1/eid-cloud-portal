import { beforeEach, describe, expect, it } from 'vitest';
import { createVerification, getVerification } from '../../../src/services/verifications.service';
import { mockFetchResponse, mockGlobalFetch } from '../../test-utils';

describe('verifications.service', () => {
  beforeEach(() => {
    mockGlobalFetch.mockReset();
  });

  it('createVerification posts to the verifications endpoint', async () => {
    mockGlobalFetch.mockResolvedValue(
      mockFetchResponse(
        { verificationId: 'vid', deeplink: 'swiyu-verify://?client_id=...' },
        true,
        201,
      ),
    );

    await expect(createVerification()).resolves.toEqual({
      verificationId: 'vid',
      deeplink: 'swiyu-verify://?client_id=...',
    });

    const [url, init] = mockGlobalFetch.mock.calls[0];
    expect(url).toBe('/api/v1/verifications');
    expect(init.method).toBe('POST');
  });

  it('getVerification fetches the verification by id', async () => {
    mockGlobalFetch.mockResolvedValue(mockFetchResponse({ state: 'SUCCESS', vaultId: 'v' }));

    await expect(getVerification('vid')).resolves.toEqual({ state: 'SUCCESS', vaultId: 'v' });
    expect(mockGlobalFetch).toHaveBeenCalledWith('/api/v1/verifications/vid', {
      method: 'GET',
      signal: undefined,
    });
  });
});

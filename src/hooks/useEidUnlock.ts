import { useCallback, useEffect, useRef, useState } from 'react';

import * as verificationsService from '../services/verifications.service';

import type { UnlockResult } from '../services/verifications.service';

type UnlockStatus = 'idle' | 'pending' | 'success' | 'error';

const POLL_INTERVAL_MS = 2000;
const POLL_TIMEOUT_MS = 120000;

export const useEidUnlock = () => {
  const [status, setStatus] = useState<UnlockStatus>('idle');
  const [deeplink, setDeeplink] = useState<string | null>(null);
  const [result, setResult] = useState<UnlockResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const clearPolling = useCallback(() => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
    abortRef.current?.abort();
    abortRef.current = null;
  }, []);

  const start = useCallback(async () => {
    clearPolling();
    setStatus('pending');
    setError(null);
    setResult(null);
    setDeeplink(null);

    try {
      const created = await verificationsService.createVerification();
      setDeeplink(created.deeplink);

      const controller = new AbortController();
      abortRef.current = controller;
      const startedAt = Date.now();

      pollTimerRef.current = setInterval(() => {
        void (async () => {
          try {
            const response = await verificationsService.getVerification(
              created.verificationId,
              controller.signal,
            );

            if (response.state === 'SUCCESS') {
              clearPolling();
              setResult(response);
              setStatus('success');
            } else if (response.state === 'FAILED' || response.state === 'EXPIRED') {
              clearPolling();
              setResult(response);
              setStatus('error');
              setError(response.error ?? 'Verification did not complete');
            } else if (Date.now() - startedAt > POLL_TIMEOUT_MS) {
              clearPolling();
              setStatus('error');
              setError('Verification timed out');
            }
          } catch {
            if (controller.signal.aborted) {
              return;
            }
            if (Date.now() - startedAt > POLL_TIMEOUT_MS) {
              clearPolling();
              setStatus('error');
              setError('Verification timed out');
            }
          }
        })();
      }, POLL_INTERVAL_MS);
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Failed to start verification');
    }
  }, [clearPolling]);

  const reset = useCallback(() => {
    clearPolling();
    setStatus('idle');
    setDeeplink(null);
    setResult(null);
    setError(null);
  }, [clearPolling]);

  useEffect(() => clearPolling, [clearPolling]);

  return { status, deeplink, result, error, handlers: { start, reset } };
};

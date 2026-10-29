import { useCallback, useMemo, useState } from 'react';

import { UnlockContext } from './unlock-context';

import type { UnlockContextValue, UnlockData } from './unlock-context';
import type { ReactNode } from 'react';

interface UnlockProviderProps {
  children: ReactNode;
}

export const UnlockProvider = ({ children }: UnlockProviderProps) => {
  const [data, setData] = useState<UnlockData | null>(null);

  const unlock = useCallback((next: UnlockData) => setData(next), []);
  const lock = useCallback(() => setData(null), []);

  const value = useMemo<UnlockContextValue>(
    () => ({
      isUnlocked: data !== null,
      vaultId: data?.vaultId ?? null,
      displayName: data?.displayName ?? null,
      masterKey: data?.masterKey ?? null,
      unlock,
      lock,
    }),
    [data, unlock, lock],
  );

  return <UnlockContext.Provider value={value}>{children}</UnlockContext.Provider>;
};

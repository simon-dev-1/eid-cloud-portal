import { createContext, useContext } from 'react';

export interface UnlockData {
  vaultId: string;
  displayName: string;
  masterKey: string;
}

export interface UnlockContextValue {
  isUnlocked: boolean;
  vaultId: string | null;
  displayName: string | null;
  masterKey: string | null;
  unlock: (data: UnlockData) => void;
  lock: () => void;
}

export const UnlockContext = createContext<UnlockContextValue | null>(null);

export const useUnlock = (): UnlockContextValue => {
  const context = useContext(UnlockContext);
  if (!context) {
    throw new Error('useUnlock must be used within an UnlockProvider');
  }
  return context;
};

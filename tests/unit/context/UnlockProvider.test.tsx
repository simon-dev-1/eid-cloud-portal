import { act, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { UnlockProvider } from '../../../src/context/UnlockProvider';
import { useUnlock } from '../../../src/context/unlock-context';

const Probe = () => {
  const { isUnlocked, displayName, unlock, lock } = useUnlock();

  return (
    <div>
      <span data-testid="isUnlocked">{String(isUnlocked)}</span>
      <span data-testid="displayName">{displayName ?? ''}</span>
      <button
        type="button"
        onClick={() => unlock({ vaultId: 'v', displayName: 'Max Muster', masterKey: 'k' })}
      >
        unlock
      </button>
      <button type="button" onClick={lock}>
        lock
      </button>
    </div>
  );
};

describe('UnlockProvider', () => {
  it('starts locked, unlocks, and locks again', () => {
    render(
      <UnlockProvider>
        <Probe />
      </UnlockProvider>,
    );

    expect(screen.getByTestId('isUnlocked')).toHaveTextContent('false');

    act(() => screen.getByText('unlock').click());
    expect(screen.getByTestId('isUnlocked')).toHaveTextContent('true');
    expect(screen.getByTestId('displayName')).toHaveTextContent('Max Muster');

    act(() => screen.getByText('lock').click());
    expect(screen.getByTestId('isUnlocked')).toHaveTextContent('false');
    expect(screen.getByTestId('displayName')).toHaveTextContent('');
  });
});

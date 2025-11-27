import { useState } from 'react';
import type { FormEvent } from 'react';

type PasswordGateProps = {
  storedHash: string | null;
  onUnlock: (passphrase: string) => void;
  onReset: () => void;
  authError?: string | null;
};

export const PasswordGate = ({ storedHash, onUnlock, onReset, authError }: PasswordGateProps) => {
  const [passphrase, setPassphrase] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const isNewUser = !storedHash;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!passphrase.trim()) {
      setError('Passphrase is required.');
      return;
    }

    if (isNewUser && passphrase !== confirmation) {
      setError('Passphrases do not match.');
      return;
    }

    onUnlock(passphrase);
    setPassphrase('');
    setConfirmation('');
  };

  return (
    <div className="gate">
      <h1>Private Notes</h1>
      <p className="gate__subtitle">
        {isNewUser
          ? 'Create a passphrase to encrypt notes locally. Keep it safe — it never leaves your device.'
          : 'Enter your passphrase to decrypt your offline notes.'}
      </p>

      <form onSubmit={handleSubmit} className="gate__form">
        <label>
          Passphrase
          <input
            type="password"
            value={passphrase}
            autoComplete="new-password"
            onChange={(event) => setPassphrase(event.target.value)}
            placeholder="••••••••"
          />
        </label>

        {isNewUser && (
          <label>
            Confirm passphrase
            <input
              type="password"
              value={confirmation}
              autoComplete="new-password"
              onChange={(event) => setConfirmation(event.target.value)}
              placeholder="Repeat passphrase"
            />
          </label>
        )}

        {(error || authError) && <p className="gate__error">{error ?? authError}</p>}

        <button type="submit">{isNewUser ? 'Create passphrase' : 'Unlock'}</button>
      </form>

      {!isNewUser && (
        <div className="gate__reset">
          {showResetConfirm ? (
            <>
              <p>Resetting will delete all notes. Continue?</p>
              <button type="button" onClick={onReset} className="link">
                Yes, delete everything
              </button>
              <button type="button" onClick={() => setShowResetConfirm(false)} className="link">
                Cancel
              </button>
            </>
          ) : (
            <button type="button" onClick={() => setShowResetConfirm(true)} className="link">
              Forgot passphrase? Reset workspace
            </button>
          )}
        </div>
      )}
    </div>
  );
};


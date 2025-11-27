import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';

const STORAGE_KEY = 'secure-notes-cloud-sync';

type CloudSyncState = {
  connected: boolean;
  email?: string;
  lastSync?: number;
};

const loadState = (): CloudSyncState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CloudSyncState) : { connected: false };
  } catch {
    return { connected: false };
  }
};

const persistState = (state: CloudSyncState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const CloudSyncBanner = () => {
  const [state, setState] = useState<CloudSyncState>(() => loadState());
  const [email, setEmail] = useState('');

  useEffect(() => {
    persistState(state);
  }, [state]);

  const handleConnect = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) return;
    const next: CloudSyncState = { connected: true, email, lastSync: Date.now() };
    setState(next);
    setEmail('');
  };

  const handleSync = () => {
    setState((prev) => ({ ...prev, lastSync: Date.now(), connected: true }));
  };

  const handleDisconnect = () => {
    setState({ connected: false });
  };

  if (!state.connected) {
    return (
      <section className="cloud-sync">
        <h3>Optional cloud backup</h3>
        <p>Keep notes offline-first today. When you are ready, hook up a future sync target.</p>
        <form onSubmit={handleConnect}>
          <input
            type="email"
            placeholder="Email for sync invite"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <button type="submit">Request access</button>
        </form>
      </section>
    );
  }

  return (
    <section className="cloud-sync connected">
      <div>
        <h3>Cloud sync (beta)</h3>
        <p>
          Connected as {state.email}. {state.lastSync ? `Last sync ${new Date(state.lastSync).toLocaleString()}.` : 'No sync yet.'}
        </p>
      </div>
      <div className="cloud-sync__actions">
        <button type="button" onClick={handleSync}>
          Sync now
        </button>
        <button type="button" className="ghost" onClick={handleDisconnect}>
          Disconnect
        </button>
      </div>
    </section>
  );
};


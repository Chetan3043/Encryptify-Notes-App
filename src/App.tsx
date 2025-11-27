import { useMemo, useState } from 'react';
import { CloudSyncBanner } from './components/CloudSyncBanner';
import { NoteCard } from './components/NoteCard';
import { NoteEditor } from './components/NoteEditor';
import { NotesToolbar } from './components/NotesToolbar';
import { PasswordGate } from './components/PasswordGate';
import { PASS_HASH_KEY, hashPassphrase } from './crypto';
import { clearEncryptedStore } from './db';
import { useEncryptedNotes } from './hooks/useEncryptedNotes';
import type { Note, NoteDraft } from './types';

const filterNotes = (notes: Note[], query: string, showArchived: boolean) => {
  const normalized = query.trim().toLowerCase();

  return notes.filter((note) => {
    if (note.archived !== showArchived) return false;
    if (!normalized) return true;
    return note.title.toLowerCase().includes(normalized) || note.content.toLowerCase().includes(normalized);
  });
};

export const App = () => {
  const [storedHash, setStoredHash] = useState<string | null>(() => localStorage.getItem(PASS_HASH_KEY));
  const [passphrase, setPassphrase] = useState<string | null>(null);
  const [gateError, setGateError] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [query, setQuery] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  const { notes, loading, error, persistNote, deleteNote, togglePin, toggleArchive, refresh } = useEncryptedNotes(passphrase);

  const visibleNotes = useMemo(() => filterNotes(notes, query, showArchived), [notes, query, showArchived]);

  const handleUnlock = (input: string) => {
    if (!storedHash) {
      const hashed = hashPassphrase(input);
      localStorage.setItem(PASS_HASH_KEY, hashed);
      setStoredHash(hashed);
      setPassphrase(input);
      setGateError(null);
      return;
    }

    if (hashPassphrase(input) !== storedHash) {
      setGateError('Incorrect passphrase.');
      return;
    }

    setGateError(null);
    setPassphrase(input);
  };

  const handleReset = async () => {
    await clearEncryptedStore();
    localStorage.removeItem(PASS_HASH_KEY);
    setStoredHash(null);
    setPassphrase(null);
    setQuery('');
    setEditingNote(null);
    setGateError(null);
  };

  const handleSave = async (draft: NoteDraft) => {
    await persistNote(draft);
    setEditingNote(null);
  };

  const handleDelete = async (note: Note) => {
    const confirmed = window.confirm('Delete this encrypted note? This cannot be undone.');
    if (!confirmed) return;
    await deleteNote(note.id);
    if (editingNote?.id === note.id) {
      setEditingNote(null);
    }
  };

  if (!passphrase) {
    return <PasswordGate storedHash={storedHash} onUnlock={handleUnlock} onReset={handleReset} authError={gateError} />;
  }

  return (
    <main className="app-shell">
      <header className="app-shell__header">
        <div>
          <p className="eyebrow">Encrypted notes</p>
          <h1>Vault Notes</h1>
        </div>
        <div className="app-shell__header-actions">
          <button type="button" className="ghost" onClick={() => setShowArchived((prev) => !prev)}>
            {showArchived ? 'Viewing archive' : 'Viewing active'}
          </button>
          <button type="button" className="ghost" onClick={() => setPassphrase(null)}>
            Lock vault
          </button>
        </div>
      </header>

      <CloudSyncBanner />

      <NoteEditor activeNote={editingNote} onSave={handleSave} onCancelEdit={() => setEditingNote(null)} />

      <NotesToolbar
        query={query}
        onQueryChange={setQuery}
        showArchived={showArchived}
        onToggleArchived={() => setShowArchived((prev) => !prev)}
        onRefresh={refresh}
      />

      {loading && <p className="status">Decrypting notes…</p>}
      {error && <p className="status error">{error}</p>}

      {!loading && visibleNotes.length === 0 && (
        <p className="status muted">{showArchived ? 'No archived notes yet.' : 'No notes match your filters.'}</p>
      )}

      <section className="notes-grid">
        {visibleNotes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onEdit={setEditingNote}
            onDelete={handleDelete}
            onTogglePin={togglePin}
            onToggleArchive={toggleArchive}
          />
        ))}
      </section>
    </main>
  );
};



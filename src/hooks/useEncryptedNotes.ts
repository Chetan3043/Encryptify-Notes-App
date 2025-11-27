import { useCallback, useEffect, useMemo, useState } from 'react';
import { deleteEncryptedRecord, getEncryptedRecords, saveEncryptedRecord } from '../db';
import { decryptNote, encryptNote } from '../crypto';
import type { Note, NoteDraft } from '../types';

const sortNotes = (notes: Note[]) =>
  [...notes].sort((a, b) => {
    if (a.pinned !== b.pinned) {
      return a.pinned ? -1 : 1;
    }

    return b.updatedAt - a.updatedAt;
  });

const createId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const useEncryptedNotes = (passphrase: string | null) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasPassphrase = useMemo(() => Boolean(passphrase), [passphrase]);

  const hydrate = useCallback(async () => {
    if (!passphrase) {
      setNotes([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);

    try {
      const encrypted = await getEncryptedRecords();
      const decrypted = encrypted.map((record) => decryptNote(record.ciphertext, passphrase));
      setNotes(sortNotes(decrypted));
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Unable to load notes');
    } finally {
      setLoading(false);
    }
  }, [passphrase]);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  const persistNote = useCallback(
    async (draft: NoteDraft) => {
      if (!passphrase) {
        throw new Error('Missing passphrase');
      }

      const now = Date.now();
      const existing = draft.id ? notes.find((note) => note.id === draft.id) : undefined;
      const note: Note = {
        id: draft.id ?? createId(),
        title: draft.title.trim(),
        content: draft.content.trim(),
        pinned: draft.pinned ?? existing?.pinned ?? false,
        archived: draft.archived ?? existing?.archived ?? false,
        createdAt: existing?.createdAt ?? now,
        updatedAt: now,
      };

      const ciphertext = encryptNote(note, passphrase);
      await saveEncryptedRecord({
        id: note.id,
        ciphertext,
        updatedAt: note.updatedAt,
      });

      setNotes((prev) => sortNotes([note, ...prev.filter((item) => item.id !== note.id)]));
      return note;
    },
    [notes, passphrase]
  );

  const deleteNote = useCallback(async (id: string) => {
    await deleteEncryptedRecord(id);
    setNotes((prev) => prev.filter((note) => note.id !== id));
  }, []);

  const togglePin = useCallback(
    async (note: Note) => {
      await persistNote({ ...note, pinned: !note.pinned });
    },
    [persistNote]
  );

  const toggleArchive = useCallback(
    async (note: Note) => {
      await persistNote({ ...note, archived: !note.archived });
    },
    [persistNote]
  );

  return {
    notes,
    loading,
    error,
    hasPassphrase,
    persistNote,
    deleteNote,
    togglePin,
    toggleArchive,
    refresh: hydrate,
  };
};


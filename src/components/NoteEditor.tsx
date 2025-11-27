import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import type { Note, NoteDraft } from '../types';

type NoteEditorProps = {
  activeNote: Note | null;
  onSave: (draft: NoteDraft) => Promise<void> | void;
  onCancelEdit: () => void;
};

const emptyDraft: NoteDraft = {
  title: '',
  content: '',
  pinned: false,
  archived: false,
};

export const NoteEditor = ({ activeNote, onSave, onCancelEdit }: NoteEditorProps) => {
  const [draft, setDraft] = useState<NoteDraft>(emptyDraft);
  const isEditing = Boolean(activeNote);

  useEffect(() => {
    if (activeNote) {
      setDraft({
        id: activeNote.id,
        title: activeNote.title,
        content: activeNote.content,
        pinned: activeNote.pinned,
        archived: activeNote.archived,
      });
    } else {
      setDraft(emptyDraft);
    }
  }, [activeNote]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.title.trim() && !draft.content.trim()) {
      return;
    }

    await onSave({
      ...draft,
      pinned: Boolean(draft.pinned),
    });

    if (!isEditing) {
      setDraft(emptyDraft);
    }
  };

  const handleChange = (field: keyof NoteDraft, value: string | boolean) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <section className="editor">
      <form onSubmit={handleSubmit}>
        <div className="editor__header">
          <h2>{isEditing ? 'Edit note' : 'New note'}</h2>
          <label className="pill-toggle">
            <input
              type="checkbox"
              checked={Boolean(draft.pinned)}
              onChange={(event) => handleChange('pinned', event.target.checked)}
            />
            Pin
          </label>
        </div>

        <input
          type="text"
          value={draft.title}
          placeholder="Note title"
          onChange={(event) => handleChange('title', event.target.value)}
        />

        <textarea
          value={draft.content}
          placeholder="Start typing..."
          rows={6}
          onChange={(event) => handleChange('content', event.target.value)}
        />

        <div className="editor__actions">
          {isEditing && (
            <button type="button" onClick={onCancelEdit} className="ghost">
              Cancel
            </button>
          )}
          <button type="submit">{isEditing ? 'Save changes' : 'Add note'}</button>
        </div>
      </form>
    </section>
  );
};


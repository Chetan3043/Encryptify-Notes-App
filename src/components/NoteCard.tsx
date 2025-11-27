import type { Note } from '../types';

type NoteCardProps = {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
  onTogglePin: (note: Note) => void;
  onToggleArchive: (note: Note) => void;
};

const formatDate = (timestamp: number) =>
  new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(timestamp);

export const NoteCard = ({ note, onEdit, onDelete, onTogglePin, onToggleArchive }: NoteCardProps) => (
  <article className={`note-card ${note.pinned ? 'note-card--pinned' : ''} ${note.archived ? 'note-card--archived' : ''}`}>
    <header>
      <div>
        {note.pinned && <span className="badge">Pinned</span>}
        {note.archived && <span className="badge muted">Archived</span>}
        <h3>{note.title || 'Untitled note'}</h3>
      </div>
      <time dateTime={new Date(note.updatedAt).toISOString()}>{formatDate(note.updatedAt)}</time>
    </header>

    <p>{note.content}</p>

    <footer>
      <button type="button" className="ghost" onClick={() => onEdit(note)}>
        Edit
      </button>
      <button type="button" className="ghost" onClick={() => onTogglePin(note)}>
        {note.pinned ? 'Unpin' : 'Pin'}
      </button>
      <button type="button" className="ghost" onClick={() => onToggleArchive(note)}>
        {note.archived ? 'Unarchive' : 'Archive'}
      </button>
      <button type="button" className="danger" onClick={() => onDelete(note)}>
        Delete
      </button>
    </footer>
  </article>
);



type NotesToolbarProps = {
  query: string;
  onQueryChange: (value: string) => void;
  showArchived: boolean;
  onToggleArchived: () => void;
  onRefresh: () => void;
};

export const NotesToolbar = ({ query, onQueryChange, showArchived, onToggleArchived, onRefresh }: NotesToolbarProps) => (
  <section className="toolbar">
    <input
      type="search"
      value={query}
      placeholder="Search encrypted notes…"
      onChange={(event) => onQueryChange(event.target.value)}
    />
    <div className="toolbar__actions">
      <button type="button" className="ghost" onClick={onToggleArchived}>
        {showArchived ? 'Show active' : 'View archive'}
      </button>
      <button type="button" className="ghost" onClick={onRefresh}>
        Refresh
      </button>
    </div>
  </section>
);



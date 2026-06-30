export default function NoteCard({ note, onEdit, onDelete }) {
  const date = new Date(note.updatedAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  return (
    <div className="note-card">
      <div className="note-card-title">{note.title}</div>
      {note.content && (
        <div className="note-card-content">{note.content}</div>
      )}
      <div className="note-card-footer">
        <span className="note-card-date">{date}</span>
        <div className="card-actions">
          <button className="btn-icon edit" onClick={() => onEdit(note)}>
            Edit
          </button>
          <button className="btn-icon delete" onClick={() => onDelete(note.id)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
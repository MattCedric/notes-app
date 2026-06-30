import NoteCard from './NoteCard';

export default function NoteList({ notes, onEdit, onDelete }) {
  if (!notes.length) return <p className="empty">No notes yet. Create one above.</p>;

  return (
    <div className="note-grid">
      {notes.map(note => (
        <NoteCard key={note.id} note={note} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
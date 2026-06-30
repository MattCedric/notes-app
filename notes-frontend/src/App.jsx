import { useState, useEffect } from 'react';
import { getNotes, createNote, updateNote, deleteNote } from './api/notesApi';
import NoteForm from './components/NoteForm';
import NoteCard from './components/NoteCard';
import './App.css';

export default function App() {
  const [notes, setNotes]     = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await getNotes();
    setNotes(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (note) => {
    if (editing) {
      await updateNote(editing.id, note);
      setEditing(null);
    } else {
      await createNote(note);
    }
    load();
  };

  const handleDelete = async (id) => {
    await deleteNote(id);
    load();
  };

  const sorted = [...notes].sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
  );

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-row">
            <div className="logo-icon">📝</div>
            <span className="app-title">This is Noted!</span>
          </div>
          <div className="note-count">
            {notes.length} {notes.length === 1 ? 'note' : 'notes'}
          </div>
        </div>

        <NoteForm
          initial={editing}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />

        <div className="sidebar-list">
          {sorted.map(note => (
            <div
              key={note.id}
              className={`sidebar-item${editing?.id === note.id ? ' active' : ''}`}
              onClick={() => setEditing(note)}
            >
              <div className="sidebar-item-title">{note.title}</div>
              {note.content && (
                <div className="sidebar-item-preview">{note.content}</div>
              )}
              <div className="sidebar-item-date">
                {new Date(note.updatedAt).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric'
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main panel */}
      <main className="main-panel">
        <div className="main-header">
          <span className="main-header-title">All notes</span>
          <span className="note-count">{notes.length} total</span>
        </div>

        {loading ? (
          <div className="loading-row">
            <div className="spinner" />
            Loading your notes…
          </div>
        ) : (
          <div className="notes-grid">
            {sorted.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🗒️</div>
                <h3>No notes yet</h3>
                <p>Use the form on the left to create your first note.</p>
              </div>
            ) : (
              sorted.map(note => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={setEditing}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
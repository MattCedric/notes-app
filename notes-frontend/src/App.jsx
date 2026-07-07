import { useState, useEffect } from 'react';
import { getNotes, createNote, updateNote, deleteNote } from './api/notesApi';
import { getLocation } from './api/geoApi';
import { getQuote } from './api/quoteApi';
import NoteForm from './components/NoteForm';
import NoteCard from './components/NoteCard';
import './App.css';

export default function App() {
  const [notes,    setNotes]    = useState([]);
  const [editing,  setEditing]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [location, setLocation] = useState(null);
  const [quote,    setQuote]    = useState(null);

  const load = async () => {
    try {
      const { data } = await getNotes();
      setNotes(data);
    } catch (err) {
      console.error('Failed to load notes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    getLocation().then(setLocation).catch(() => {});
    getQuote().then(setQuote).catch(() => {});
  }, []);

  const handleSave = async (note) => {
    try {
      if (editing) {
        await updateNote(editing.id, note);
        setEditing(null);
      } else {
        await createNote(note);
      }
      load();
    } catch (err) {
      console.error('Failed to save note:', err);
    }
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

          {/* Geolocation */}
          {location && (
  <div className="geo-badge">
    📍 {location.city}, {location.country}
  </div>
)}

          {/* Quote */}
          {quote && (
            <div className="sidebar-quote">
              <p className="sidebar-quote-text">"{quote.quote}"</p>
              <span className="sidebar-quote-author">— {quote.author}</span>
            </div>
          )}
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
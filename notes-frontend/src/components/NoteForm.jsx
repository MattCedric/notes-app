import { useState, useEffect } from 'react';

export default function NoteForm({ initial, onSave, onCancel }) {
  const [title,   setTitle]   = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    setTitle(initial?.title ?? '');
    setContent(initial?.content ?? '');
  }, [initial]);

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title, content });
    setTitle('');
    setContent('');
  };

  return (
    <form className="note-form" onSubmit={submit}>
      <div className="form-label">{initial ? 'Edit note' : 'New note'}</div>
      <input
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Write something…"
        value={content}
        onChange={e => setContent(e.target.value)}
        rows={4}
      />
      <div className="form-actions">
        <button type="submit" className="btn-primary">
          {initial ? 'Save changes' : 'Add note'}
        </button>
        {initial && (
          <button type="button" className="btn-ghost" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
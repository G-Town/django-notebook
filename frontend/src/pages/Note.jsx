import{ useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';

const mdParser = new MarkdownIt();

const Note = ({ note, onSave, onDelete }) => {
  const [editedNote, setEditedNote] = useState(note);

  const handleEditorChange = useCallback(({ text }) => {
    setEditedNote(prevNote => ({
      ...prevNote,
      content: text
    }));
  }, []);

  const handleSave = useCallback(() => {
    onSave(editedNote);
  }, [editedNote, onSave]);

  return (
    <div className="note-content">
      <input
        type="text"
        value={editedNote.title}
        onChange={(e) => setEditedNote(prev => ({ ...prev, title: e.target.value }))}
        className="note-title-input"
      />
      <MdEditor
        value={editedNote.content}
        style={{ height: '500px' }}
        renderHTML={(text) => mdParser.render(text)}
        onChange={handleEditorChange}
      />
      <div className="note-actions">
        <button onClick={handleSave}>Save</button>
        <button onClick={() => onDelete(note.id)}>Delete</button>
      </div>
    </div>
  );
};

Note.propTypes = {
  note: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
  }).isRequired,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default Note;
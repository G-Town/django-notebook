/* eslint-disable react/prop-types */
import { useState, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, List, ListOrdered, Heading1, Heading2 } from 'lucide-react';
import '../styles/Note.css';

const Note = ({ note, onEdit, onDelete }) => {
  const [title, setTitle] = useState(note.title);

  const editor = useEditor({
    extensions: [StarterKit],
    content: note.content,
    onUpdate: ({ editor }) => {
      onEdit(note.id, { content: editor.getHTML() });
    },
  });

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    onEdit(note.id, { title: e.target.value });
  };

  const focusEditor = useCallback(() => {
    if (editor) {
      editor.chain().focus().run();
    }
  }, [editor]);

  const ToolbarButton = ({ icon: Icon, onClick }) => (
    <button
      onMouseDown={(e) => e.preventDefault()} // Prevent blur
      onClick={() => {
        focusEditor();
        onClick();
      }}
      className="toolbar-button"
    >
      <Icon size={20} />
    </button>
  );

  return (
    <div className="note-content">
      <input
        type="text"
        value={title}
        onChange={handleTitleChange}
        className="note-title"
      />
      <div className="note-toolbar">
        <ToolbarButton
          icon={Bold}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
        <ToolbarButton
          icon={Italic}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />
        <ToolbarButton
          icon={Heading1}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        />
        <ToolbarButton
          icon={Heading2}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        />
        <ToolbarButton
          icon={List}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />
        <ToolbarButton
          icon={ListOrdered}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        />
      </div>
      <EditorContent editor={editor} className="note-editor" />
      <div className="note-actions">
        <button
          onClick={() => onDelete(note.id)}
          className="delete-button"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default Note;
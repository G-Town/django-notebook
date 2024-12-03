/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback } from "react";
import { getNote } from "../services/noteService";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
} from "lucide-react";
import "../styles/Note.css";

const Note = ({ noteId, onEdit, onDelete }) => {
  const [note, setNote] = useState(null);
  // const [title, setTitle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const editor = useEditor({
    extensions: [StarterKit],
    content: note?.content || "",
    parseOptions: {
      preserveWhitespace: "full",
    },
    onUpdate: ({ editor }) => {
      onEdit(note.id, { content: editor.getHTML() });
    },
  });

  useEffect(() => {
    const fetchNoteData = async () => {
      try {
        setIsLoading(true);
        const fetchedNote = await getNote(noteId);
        console.log("🚀 ~ fetchNoteData ~ noteId:", noteId);
        // console.log("🚀 ~ fetchNoteData ~ fetchedNote:", fetchedNote.title || "Untitled")
        setNote(fetchedNote);
        editor.commands.setContent(fetchedNote.content, false, {
          preserveWhitespace: "full",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchNoteData();
  }, [noteId, editor]);

  const handleTitleChange = (e) => {
    // setTitle(e.target.value);
    // onEdit(note.id, { title: e.target.value });
    if (note) {
      const newTitle = e.target.value;
      setNote((prev) => ({ ...prev, title: newTitle }));
      onEdit(note.id, { title: newTitle });
    }
  };

  const focusEditor = useCallback(() => {
    if (editor) {
      editor.chain().focus().run();
    }
  }, [editor]);

  const ToolbarButton = ({ icon: Icon, onClick }) => (
    <button
      onMouseDown={(e) => e.preventDefault()} // Prevents blur?
      onClick={() => {
        focusEditor();
        onClick();
      }}
      className="toolbar-button"
    >
      <Icon size={20} />
    </button>
  );

  // if (!note) {
  //   return <div>No note found</div>;
  // }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="note-content">
      <input
        type="text"
        value={note.title || ""}
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
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        />
        <ToolbarButton
          icon={Heading2}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
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
        <button onClick={() => onDelete(note.id)} className="delete-button">
          Delete
        </button>
      </div>
    </div>
  );
};

export default Note;

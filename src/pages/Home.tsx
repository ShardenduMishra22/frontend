import { useEffect, useState } from "react";
import api from "../api";

interface Note {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

const Home = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [content, setContent] = useState<string>("");
  const [title, setTitle] = useState<string>("");

  const getNotes = () => {
    api
      .get("/api/notes/")
      .then((res) => {
        setNotes(res.data);
      })
      .catch((error) => {
        console.error("Error fetching notes:", error);
      });
  };

  const deleteNote = (id: number) => {
    api
      .delete(`/api/notes/delete/${id}/`)
      .then((res) => {
        if (res.status === 204) alert("Note deleted!");
        else alert("Failed to delete note.");
        getNotes();
      })
      .catch((error) => {
        console.error("Error deleting note:", error);
        alert("Failed to delete note.");
      });
  };

  const createNote = (e: React.FormEvent) => {
    e.preventDefault();
    api
      .post("/api/notes/", { content, title })
      .then((res) => {
        if (res.status === 201) alert("Note created!");
        else alert("Failed to create note.");
        getNotes();
      })
      .catch((err) => {
        console.error("Error creating note:", err);
        alert("Failed to create note.");
      });
  };

  useEffect(() => {
    getNotes();
  }, []);

  return (
    <div>
      <div>
        {notes.map((note) => (
          <div key={note.id}>
            <h2>{note.title}</h2>
            <p>{note.content}</p>
            <p>{new Date(note.created_at).toLocaleDateString("en-US")}</p>
            <button onClick={() => deleteNote(note.id)}>Delete</button>
          </div>
        ))}
      </div>
      <h2>Create a Note</h2>
      <form onSubmit={createNote}>
        <label htmlFor="title">Title:</label>
        <br />
        <input
          type="text"
          id="title"
          name="title"
          required
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <br />
        <label htmlFor="content">Content:</label>
        <br />
        <textarea
          id="content"
          name="content"
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Home;
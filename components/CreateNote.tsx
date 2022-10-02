import react, { useState } from "react";
import { useRouter } from "next/router";

interface Note {
    note: {
        color: string,
        page: number,
        dateOfPost: string,
        text: string,
    }
}

interface CreateNote {
    color: string,
    commentingActive: boolean,
}

const Note: React.FC<Note> = ({ note }) => {
  return (
    <div
      style={{ backgroundColor: note.color }}
      className={`rounded-lg shadow-lg m-[5%] divide-y border border-black divide-black`}
    >
      <div className="flex justify-between items-center">
        <div className="font-bold text-xs p-3">Page {note.page}</div>
        <div className="font-bold text-xs p-3">{note.dateOfPost}</div>
      </div>
      <div className="p-3">{note.text}</div>
    </div>
  );
};

const CreateNote: React.FC<CreateNote> = ({ color, commentingActive }) => {
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState([]);

  const router = useRouter();

  const submitComment = (event) => {
    event.preventDefault();

    const page = router.query.page;

    const date = new Date();

    const dateOfPost = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;

    const note = {
      text: noteText,
      color,
      dateOfPost,
      page,
    };

    setNotes([...notes, note]);
    setNoteText("");
  };

  return (
    <>
    {commentingActive && (
      <div className="w-[90%] m-[5%] mt-[15%] shadow-lg rounded-lg">
        <form onSubmit={submitComment}>
          <div className="mb-4 w-full bg-gray-50 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
            <div className="p-2  bg-white rounded-t-lg dark:bg-gray-800">
              <textarea
                value={noteText}
                onChange={(event) => setNoteText(event.target.value)}
                id="comment"
                rows={4}
                className="resize-none h-[100px] px-0 w-full text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
                placeholder="Write a comment..."
                required
              ></textarea>
            </div>
            <div className="flex justify-center p-2 border-t dark:border-gray-600">
              <button
                type="submit"
                className={`text-white h-10 items-center bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-sm rounded-full text-sm px-4 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"}`}
              >
                Post a note
              </button>
            </div>
          </div>
        </form>
      </div>
    )}
      {notes.map((note) => (
        <Note note={note} />
      ))}
    </>
  );
};

export default CreateNote;

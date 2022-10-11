import react, { useState } from "react";
import { useRouter } from "next/router";

interface CreateNote {
    color: string;
    commentingActive: boolean;
    annotationId: string;
}

const CreateNote: React.FC<CreateNote> = ({ color, commentingActive, annotationId }) => {
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState([]);

  const router = useRouter();

  const submitComment = async (event) => {
    event.preventDefault();

    const page = Number(router.query.page);

    const date = new Date();

    const dateOfPost = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;

    const note = {
      text: noteText,
      dateOfPost,
      page,
    };

    await fetch(`/api/user-annotations/create-note/${annotationId}`, {
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify(note)
    })

    setNoteText("");
  };

  return (
      <div className="w-[90%] m-[5%] shadow-lg rounded-lg">
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
    )
  }


export default CreateNote;

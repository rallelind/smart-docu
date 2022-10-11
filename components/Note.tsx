interface Note {
    color: string,
    note: {
        page: number,
        dateOfPost: string,
        text: string,
    }
}

const Note: React.FC<Note> = ({ note, color }) => {
    return (
      <div
        style={{ backgroundColor: color }}
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

  export default Note
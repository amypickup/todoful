import { useState } from "react";
import type { ToDoItemType } from "./ToDoList";

export interface ToDoFormProps {
  toDo: ToDoItemType;
  index: number;
  toggleIsDone: (index: number) => void;
  deleteToDo: (index: number) => void;
  addSubToDo: (index: number) => void;
  updateToDo: (index: number, newTitle: string) => void;
}

function ToDoForm({
  toDo,
  index,
  toggleIsDone,
  deleteToDo,
  updateToDo,
  addSubToDo,
}: ToDoFormProps) {
  const [title, setTitle] = useState("");

  if (toDo.isDone === true) {
    return (
      <div className="card" key={index}>
        <input type="checkbox" checked={true} />
        <del>{toDo.title}</del>
      </div>
    );
  }

  return toDo.isDeleted ? null : (
    <div className="card" key={index}>
      <input
        type="checkbox"
        checked={toDo.isDone}
        onChange={() => toggleIsDone(index)}
      />
      <input
        type="text"
        value={toDo.title}
        onChange={(e) => updateToDo(index, e.target.value)}
      />
      <button onClick={() => deleteToDo(index)}> Delete </button>
      {toDo.parent === -1 ? (
        <button onClick={() => addSubToDo(index)}> Add Subtask </button>
      ) : null}
    </div>
  );
}

export default ToDoForm;

import { useState } from "react";
import ToDoForm from "./ToDoForm";
import useLocalStorage from "../hooks/useLocalStorage";

export interface ToDoItemType {
  id: number;
  title: string;
  isDone: boolean;
  isDeleted: boolean;
  parent: number;
}

const randomNumber = () => Math.floor(Math.random() * 9999) + 1004;
const fallbackValues = [
  {
    id: 1000,
    title: "Visit Coffee Shop",
    isDone: false,
    isDeleted: false,
    parent: -1,
  },
  {
    id: 1001,
    title: "Drink Coffee",
    isDone: false,
    isDeleted: false,
    parent: 1000,
  },
  {
    id: 1002,
    title: "Nibble Croissant",
    isDone: false,
    isDeleted: false,
    parent: 1000,
  },
  {
    id: 1003,
    title: "Dance in circles",
    isDone: false,
    isDeleted: false,
    parent: -1,
  },
];

export interface ToDoListProps {
  toDoList: ToDoItemType[];
}

function ToDoList() {
  if (window.addEventListener) {
    window.addEventListener("storage", () => {
      // When local storage changes do something like a refresh
      window.location.reload();
    });
  }

  // TODO: type using ToDoItemType and do runtime checks for data validation
  const [toDoList, setToDoList] = useLocalStorage("to-dos", fallbackValues);

  const createToDo = () => {
    const newToDoList = [
      ...toDoList,
      {
        id: randomNumber(),
        title: "",
        isDone: false,
        isDeleted: false,
        parent: -1,
      },
    ];
    setToDoList(newToDoList);
  };

  const addSubToDo = (index: number): void => {
    const newToDoList = [
      ...toDoList,
      {
        id: randomNumber(),
        title: "",
        isDone: false,
        isDeleted: false,
        parent: index,
      },
    ];
    setToDoList(newToDoList);
  };

  const updateToDo = (index: number, newTitle: string): void => {
    const newToDoList = [...toDoList];
    // TODO: This isn't a cute way of handling this error
    // Ideally, handle using invariant library, check for value then try to assign it
    // and display a nice warning to the user
    try {
      newToDoList.find((t) => t.id === index).title = newTitle;
    } catch (e) {
      console.error("Unable to fetch item at id:", index);
    }
    setToDoList(newToDoList);
  };

  // TODO: rename? this isn't actually a toggle yet
  const toggleIsDone = (index: number): void => {
    const newToDoList = [...toDoList];
    const currentToDo = newToDoList.find((t) => t.id === index);

    // Disallow users from deleting parents who still have open children to-dos
    if (currentToDo && currentToDo.parent === -1 && currentToDo.id) {
      // TODO: probably a better name for this
      const orphanList = newToDoList.filter(
        (t) =>
          t.parent === currentToDo.id &&
          t.isDone === false &&
          t.isDeleted === false
      );
      if (orphanList.length > 0) {
        alert("You must complete all subtasks to close a parent task.");
        return;
      }
    }

    // Mark task as complete
    currentToDo.isDone = true;

    setToDoList(newToDoList);
  };

  const deleteToDo = (index: number): void => {
    const newToDoList = [...toDoList];
    try {
      newToDoList.find((t) => t.id === index).isDeleted = true;
    } catch (e) {
      console.error("Unable to fetch item at id:", index);
    }
    setToDoList(newToDoList);
  };

  return (
    <>
      <h1>Graphite Take-Home To Do List</h1>
      <h2>All my incomplete To-Dos</h2>
      <div>
        {toDoList
          .filter(
            (toDo: ToDoItemType) =>
              toDo.parent === -1 &&
              toDo.isDeleted === false &&
              toDo.isDone === false
          )
          .map((toDo: ToDoItemType) => {
            const ParentToDo = (
              <ToDoForm
                toDo={toDo}
                index={toDo.id}
                toggleIsDone={toggleIsDone}
                deleteToDo={deleteToDo}
                updateToDo={updateToDo}
                addSubToDo={addSubToDo}
                key={toDo.id}
              />
            );

            const ChildrenToDos = toDoList
              .filter(
                (childToDo: ToDoItemType) =>
                  childToDo.parent === toDo.id &&
                  childToDo.isDeleted === false &&
                  childToDo.isDone === false
              )
              .map((childToDo: ToDoItemType) => {
                return (
                  <ToDoForm
                    toDo={childToDo}
                    index={childToDo.id}
                    toggleIsDone={toggleIsDone}
                    deleteToDo={deleteToDo}
                    updateToDo={updateToDo}
                    addSubToDo={addSubToDo}
                    key={childToDo.id}
                  />
                );
              });
            return (
              <div>
                {ParentToDo}
                <div className="nested">{ChildrenToDos}</div>
              </div>
            );
          })}
        <button onClick={createToDo}>Add Task</button>
      </div>
      <h2>Completed</h2>
      {toDoList
        .filter(
          (toDo: ToDoItemType) =>
            toDo.isDeleted === false && toDo.isDone === true
        )
        .map((toDo: ToDoItemType) => (
          <ToDoForm
            toDo={toDo}
            index={toDo.id}
            toggleIsDone={toggleIsDone}
            deleteToDo={deleteToDo}
            updateToDo={updateToDo}
            addSubToDo={addSubToDo}
            key={toDo.id}
          />
        ))}
    </>
  );
}

export default ToDoList;

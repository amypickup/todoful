import { useEffect, useState } from "react";
import type { ToDoItemType } from "../components/ToDoList";

type KeyType = "to-dos";
type FallbackValueType = ToDoItemType[];

const useLocalStorage = (key: KeyType, fallbackValue: FallbackValueType) => {
  const [value, setValue] = useState(
    JSON.parse(localStorage.getItem(key)) ?? fallbackValue
  );

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
};

export default useLocalStorage;

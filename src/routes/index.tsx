import { useEffect, useState } from "react";

import { createFileRoute } from "@tanstack/react-router";

type Todo = {
  ID: number;
  Label: string;
};

type Action =
  | { type: "ADD"; label: string }
  | { type: "DELETE"; index: number };

export const Route = createFileRoute("/")({
  component: () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [input, setInput] = useState<string>("");
    const [uncommittedActions, setUncommittedActions] = useState<Action[]>([]);

    useEffect(() => {
      if (!navigator.onLine) {
        fetch(`${import.meta.env.VITE_BACKEND_URL!}/todo`)
          .then((res) => res.json())
          .then((result) => {
            setTodos(result);
          });
        uncommittedActions.forEach((action) => {
          if (action.type === "ADD") {
            fetch(`${import.meta.env.VITE_BACKEND_URL!}/todo`, {
              method: "POST",
              body: JSON.stringify({ label: action.label, done: false }),
              headers: {
                "Content-Type": "application/json",
              },
            })
              .then((res) => res.json())
              .then((result) => {
                setTodos([...todos, { ID: result.ID, Label: action.label }]);
              });
          } else if (action.type === "DELETE") {
            fetch(`${import.meta.env.VITE_BACKEND_URL!}/todo/${action.index}`, {
              method: "PUT",
            });
            setTodos(todos.filter((todo) => todo.ID !== action.index));
          }
        });
        setUncommittedActions([]);
      }
    }, [navigator.onLine]);

    const addTodo = () => {
      if (!input.trim()) return;
      if (navigator.onLine) {
        fetch(`${import.meta.env.VITE_BACKEND_URL!}/todo`, {
          method: "POST",
          body: JSON.stringify({ label: input, done: false }),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((result) => {
            setTodos([...todos, { ID: result.ID, Label: input }]);
          });
      } else {
        setUncommittedActions([
          ...uncommittedActions,
          { type: "ADD", label: input },
        ]);
      }
      setInput("");
    };

    const removeTodo = (index: number) => {
      if (navigator.onLine) {
        fetch(`${import.meta.env.VITE_BACKEND_URL!}/todo/${index}`, {
          method: "PUT",
        });
      } else {
        setUncommittedActions([
          ...uncommittedActions,
          { type: "DELETE", index },
        ]);
      }
      setTodos(todos.filter((todo) => todo.ID !== index));
    };

    return (
      <div>
        <h1>ToDo App</h1>
        <input
          onChange={(e) => setInput(e.target.value)}
          type="text"
          value={input}
        />
        <button onClick={addTodo}>Add ToDo</button>
        <ul>
          {todos.map((todo) => (
            <li key={todo.ID}>
              {todo.Label}
              <button onClick={() => removeTodo(todo.ID)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    );
  },
});

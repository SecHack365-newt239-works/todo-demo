import { useEffect, useState } from "react";

import { createFileRoute } from "@tanstack/react-router";

type Todo = {
  ID: number;
  Label: string;
};

export const Route = createFileRoute("/")({
  component: () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [input, setInput] = useState<string>("");

    useEffect(() => {
      fetch(`${import.meta.env.VITE_BACKEND_URL!}/todo`)
        .then((res) => res.json())
        .then((result) => {
          setTodos(result);
        });
    }, []);

    const addTodo = () => {
      if (!input.trim()) return;
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
      setInput("");
    };

    const removeTodo = (index: number) => {
      fetch(`${import.meta.env.VITE_BACKEND_URL!}/todo/${index}`, {
        method: "PUT",
      });
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

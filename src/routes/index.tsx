import { useState } from "react";

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: () => {
    const [todos, setTodos] = useState<string[]>([]);
    const [input, setInput] = useState<string>("");

    const addTodo = () => {
      if (!input.trim()) return;
      setTodos([...todos, input]);
      setInput("");
    };

    const removeTodo = (index: number) => {
      setTodos(todos.filter((_, i) => i !== index));
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
          {todos.map((todo, index) => (
            <li key={index}>
              {todo}
              <button onClick={() => removeTodo(index)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    );
  },
});

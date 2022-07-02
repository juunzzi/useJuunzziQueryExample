import { client } from "apis";
import { AxiosError } from "axios";
import CountIndicator from "components/CountIndicator";
import Todo from "components/Todo";
import TodoInput from "components/TodoInput";
import { useJuunzziQuery } from "hooks/useJuunzziQuery";
import { useState } from "react";
import { useEffect } from "react";

export interface TodoType {
  id: number;
  title: string;
  completed: boolean;
}

function App() {
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AxiosError | null>(null);

  const data = useJuunzziQuery(
    "/todos",
    async () => await client.get<TodoType[]>("/todos"),
    "App"
  );

  const handleAddTodo = async (title: string) => {
    try {
      const lastTodo = todos.at(-1);
      const newTodo = {
        id: lastTodo ? lastTodo.id + 1 : 1,
        title,
        completed: false,
      };

      await client.post(`/todos`, newTodo);

      setTodos((todos) => [...todos, newTodo]);
    } catch (e) {
      if (e instanceof AxiosError) {
        setError(e);
      }
    }
  };

  const handleCheckTodo = async (id: number) => {
    const targetTodo = todos.find((todo) => todo.id === id);
    if (!targetTodo) return;

    const newTodo = { ...targetTodo, completed: !targetTodo.completed };

    try {
      await client.put(`/todos/${id}`, newTodo);

      const newTodos = todos.map((todo) => {
        if (todo.id === id) return newTodo;
        return todo;
      });
      setTodos(newTodos);
    } catch (e) {
      if (e instanceof AxiosError) {
        setError(e);
      }
    }
  };

  const handleDeleteTodo = async (id: number) => {
    const targetTodo = todos.find((todo) => todo.id === id);
    if (!targetTodo) return;

    try {
      await client.delete(`/todos/${id}`);

      const newTodos = todos.filter((todo) => todo.id !== id);
      setTodos(newTodos);
    } catch (e) {
      if (e instanceof AxiosError) {
        setError(e);
      }
    }
  };

  if (isLoading) return <>...Loading</>;
  if (error) return <>Error!</>;
  console.log("render");
  return (
    <>
      {todos.map((todo) => (
        <Todo
          key={todo.id}
          todo={todo}
          handleCheckTodo={handleCheckTodo}
          handleDeleteTodo={handleDeleteTodo}
        />
      ))}
      <TodoInput handleAddTodo={handleAddTodo} />
      <CountIndicator
        completedCount={todos.filter((todo) => todo.completed).length}
      />
    </>
  );
}

export default App;

import React, { useEffect, useState } from 'react';
import { fetchTodos, createTodo, updateTodo, deleteTodo } from '../api';
import '../App.css';

interface Todo {
  id: number;
  title: string;
  description?: string;
  status: string;
}

interface TodoListProps {
  token: string;
  onLogout: () => void;
}

export default function TodoList({ token, onLogout }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const loadTodos = async () => {
    try {
      const fetchedTodos = await fetchTodos(token);
      setTodos(fetchedTodos);
    } catch {
      setError('Session expired. Please log in again.');
      onLogout();
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTodo(token, title, description);
      setTitle('');
      setDescription('');
      loadTodos();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUpdate = async (id: number, fields: any) => {
    await updateTodo(token, id, fields);
    loadTodos();
  };

  const handleDelete = async (id: number) => {
    await deleteTodo(token, id);
    loadTodos();
  };

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditDescription('');
  };

  const saveEdit = async (id: number) => {
    await handleUpdate(id, { title: editTitle, description: editDescription });
    setEditingId(null);
    setEditTitle('');
    setEditDescription('');
  };

  return (
    <div className="container">
      <div className="todo-header">
        <h2>My Todos</h2>
        <button onClick={onLogout} className="button secondary-button">
          Logout
        </button>
      </div>

      <div className="card">
        <h3>Create a New Todo</h3>
        <form onSubmit={handleCreate} className="create-todo-form">
          <input
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="input"
            required
          />
          <input
            placeholder="Description (optional)"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="input"
          />
          <button type="submit" className="button primary-button">
            Add Todo
          </button>
        </form>
        {error && <div className="error-message">{error}</div>}
      </div>

      <div className="card todo-list-card">
        {todos.length === 0 ? (
          <p className="no-todos">You have no todos. Get started by adding one above!</p>
        ) : (
          <ul className="todo-list">
            {todos.map(todo => (
              <li key={todo.id} className={`todo-item ${todo.status}`}>
                {editingId === todo.id ? (
                  <div style={{ flex: 1 }}>
                    <input
                      className="input"
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      required
                    />
                    <input
                      className="input"
                      value={editDescription}
                      onChange={e => setEditDescription(e.target.value)}
                    />
                  </div>
                ) : (
                  <div>
                    <b className="todo-title">{todo.title}</b>
                    {todo.description && <p className="todo-description">{todo.description}</p>}
                  </div>
                )}
                <div className="todo-actions">
                  {editingId === todo.id ? (
                    <>
                      <button
                        onClick={() => saveEdit(todo.id)}
                        className="button small-button primary-button"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="button small-button secondary-button"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleUpdate(todo.id, { status: todo.status === 'todo' ? 'done' : 'todo' })}
                        className="button small-button status-button"
                      >
                        Mark as {todo.status === 'todo' ? 'Done' : 'Todo'}
                      </button>
                      <button
                        onClick={() => startEdit(todo)}
                        className="button small-button"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(todo.id)}
                        className="button small-button delete-button"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { postTodo } from '../../api';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { actions as todosActions } from '../../features/todos';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader';
import './AddingTodo.scss';

export const AddingTodo = () => {
  const dispatch = useAppDispatch();
  const todos = useAppSelector((state) => state.todos);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function postNewTodo(todo: Omit<Todo, 'id'>) {
    try {
      setLoading(true);
      const newTodo = await postTodo(todo);

      setNewTodoTitle('');
      dispatch(todosActions.post(newTodo));
    } catch (error) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(e.currentTarget.value);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (newTodoTitle.trim() === '') {
      setError("Todo title can't be empty");

      return;
    }

    const userIds = todos.map((todo) => todo.userId);
    const maxId = Math.max(...userIds);

    const newTodo = {
      userId: maxId + 1,
      title: newTodoTitle,
      completed: false,
    };

    postNewTodo(newTodo);
  };

  return (
    <form className="app__adding-todo adding-todo" onSubmit={handleSubmit}>
      {error && <p className="adding-todo__error">{error}</p>}

      <input
        className="adding-todo__input"
        type="text"
        placeholder="Enter new todo title"
        value={newTodoTitle}
        onChange={handleInputChange}
        disabled={isLoading}
      />
      <button
        className="adding-todo__button button"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="adding-todo__loader">
            <Loader />
          </div>
        ) : (
          'Add todo'
        )}
      </button>
    </form>
  );
};

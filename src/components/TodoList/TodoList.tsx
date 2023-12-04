import React, { useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import './TodoList.scss';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { actions as todosActions } from '../../features/todos';
import { Todo } from '../../types/Todo';
import Pagination from '../Pagination/Pagination';
import { PatchingData } from '../../types/PatchingData';
import { deleteTodo, patchTodo } from '../../api';
import { Loader } from '../Loader';

export const TodoList = () => {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const todos = useAppSelector((state) => state.todos);
  const [newTitle, setNewTitle] = useState('');
  const [editedTodoId, setEditedTodoId] = useState<number | null>(null);
  const focusedInput = useRef<null | HTMLInputElement>(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const page = +(searchParams.get('page') || 1);

  const firstItemPerPage = (page - 1) * 20;
  const lastItemPerPage = page * 20 > todos.length ? todos.length : page * 20;

  async function patchTodoOnServer(id: number, data: PatchingData) {
    try {
      setLoading(true);
      const patchingTodo = await patchTodo(id, data);

      setEditedTodoId(null);
      dispatch(todosActions.patch(patchingTodo));
    } catch (error) {
      setError('Something went wrong');
      setTimeout(() => {
        setError('');
        setEditedTodoId(null);
      }, 2000);
    } finally {
      setLoading(false);
    }
  }

  async function deleteTodoOnServer(id: number) {
    try {
      setEditedTodoId(id);
      setLoading(true);
      await deleteTodo(id);
      dispatch(todosActions.delete(id));
    } catch (error) {
      setError('Something went wrong');
      setTimeout(() => {
        setError('');
        setEditedTodoId(null);
      }, 2000);
    } finally {
      setLoading(false);
    }
  }

  const handleCompletedChange = (todo: Todo) => {
    setEditedTodoId(todo.id);
    patchTodoOnServer(todo.id, { completed: !todo.completed });
  };

  const handleEditClick = (id: number, currTitle: string) => {
    setEditedTodoId(id);
    setNewTitle(currTitle);
    setTimeout(() => focusedInput.current?.focus(), 0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.currentTarget.value);
  };

  const handleAcceptNewTitle = (todo: Todo) => {
    if (todo.title === newTitle) {
      setEditedTodoId(null);
      return;
    }

    patchTodoOnServer(todo.id, { title: newTitle });
    setNewTitle('');
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>, todo: Todo) => {
    e.preventDefault();
    handleAcceptNewTitle(todo);
  };

  return (
    <div className="app__todos todos">
      {!todos.length ? (
        <p className="todos__notification">Todos list is empty</p>
      ) : (
        <table className="todos__table">
          <thead>
            <tr className="todos__head-row">
              <th>#</th>
              <th> </th>
              <th>Title</th>
              <th> </th>
              <th> </th>
            </tr>
          </thead>

          <tbody>
            {todos
              .slice(firstItemPerPage, lastItemPerPage)
              .map((todo, index) => (
                <tr key={todo.id} className="todos__body-row">
                  <td>{index + 1 + (page - 1) * 20}</td>
                  <td className="checkbox-wrapper">
                    <input
                      type="checkbox"
                      id={`cb-${todo.id}`}
                      checked={todo.completed}
                      onChange={() => handleCompletedChange(todo)}
                    />
                    <label htmlFor={`cb-${todo.id}`} className="check-box" />
                  </td>
                  <td onClick={() => console.log(todo.id)}>
                    {editedTodoId === todo.id ? (
                      <form onSubmit={(e) => handleSubmit(e, todo)}>
                        <input
                          type="text"
                          className="todos__edit-input"
                          value={newTitle}
                          onChange={handleInputChange}
                          ref={focusedInput}
                        />
                      </form>
                    ) : (
                      <p
                        className={todo.completed ? 'todos__is-completed' : ''}
                      >
                        {todo.title}
                      </p>
                    )}
                  </td>
                  <td className="todos__edit-column">
                    {editedTodoId === todo.id ? (
                      <div className="todos__edit-buttons">
                        <button
                          className="todos__edit-accept button"
                          onClick={() => handleAcceptNewTitle(todo)}
                        />
                        <button
                          className="todos__edit-cancel button"
                          onClick={() => setEditedTodoId(null)}
                        />
                      </div>
                    ) : (
                      <button
                        className="todos__edit button"
                        title="Edit"
                        onClick={() => handleEditClick(todo.id, todo.title)}
                      />
                    )}
                  </td>
                  <td>
                    <button
                      className="todos__remove button"
                      title="Remove"
                      onClick={() => deleteTodoOnServer(todo.id)}
                    />
                  </td>
                  {error && todo.id === editedTodoId && (
                    <p className="todos__error">{error}</p>
                  )}
                  {isLoading && editedTodoId === todo.id && (
                    <td className="todos__loader" colSpan={5}>
                      <Loader />
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={5}>
                <Pagination />
              </td>
            </tr>
          </tfoot>
        </table>
      )}
    </div>
  );
};

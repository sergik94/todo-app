import React, { useEffect, useState } from 'react';

import { AddingTodo } from './components/AddingTodo';
import { TodoList } from './components/TodoList';
import { useAppDispatch } from './app/hooks';
import { getTodos } from './api';
import { actions as todosActions } from './features/todos';
import { Loader } from './components/Loader';

import './App.scss';

export const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  async function getTodosFromServer() {
    setIsLoading(true);
    setIsError(false);

    try {
      const data = await getTodos();

      dispatch(todosActions.get(data));
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getTodosFromServer();
  }, []);

  return (
    <>
      <div className="app">
        <div className="app__container _container">
          <h1 className="app__title">Todos</h1>

          {isLoading && <Loader />}
          {!isError && !isLoading && (
            <>
              <AddingTodo />
              <TodoList />
            </>
          )}
          {isError && !isLoading && (
            <p className="app__error">Something went wrong</p>
          )}
        </div>
      </div>
    </>
  );
};

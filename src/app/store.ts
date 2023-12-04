import { createStore, combineReducers } from 'redux';

import todosReducer from '../features/todos';

const rootReducer = combineReducers({
  todos: todosReducer,
});

export const store = createStore(rootReducer);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { Todo } from '../types/Todo';

type GetTodos = {
  type: 'TODO/get';
  payload: Todo[];
};

type PostTodo = {
  type: 'TODO/post';
  payload: Todo;
};

type PatchTodo = {
  type: 'TODO/patch';
  payload: Todo;
};

type DeleteTodo = {
  type: 'TODO/delete';
  payload: number;
};

type Actions = GetTodos | PostTodo | PatchTodo | DeleteTodo;

export const actions = {
  get: (todos: Todo[]): GetTodos => ({ type: 'TODO/get', payload: todos }),
  post: (todo: Todo): PostTodo => ({ type: 'TODO/post', payload: todo }),
  patch: (todo: Todo): PatchTodo => ({ type: 'TODO/patch', payload: todo }),
  delete: (id: number): DeleteTodo => ({ type: 'TODO/delete', payload: id }),
};

const todosReducer = (todos: Todo[] = [], action: Actions): Todo[] => {
  if (action.type === 'TODO/get') {
    return action.payload;
  }

  if (action.type === 'TODO/post') {
    return [...todos, action.payload];
  }

  if (action.type === 'TODO/patch') {
    return todos.map((todo) => {
      if (todo.id === action.payload.id) {
        return action.payload;
      }

      return todo;
    });
  }

  if (action.type === 'TODO/delete') {
    return todos.filter((todo) => todo.id !== action.payload);
  }

  return todos;
};

export default todosReducer;

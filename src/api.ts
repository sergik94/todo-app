import { PatchingData } from './types/PatchingData';
import { Todo } from './types/Todo';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

type RequestMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

function request<T>(
  url: string,
  method: RequestMethod = 'GET',
  data: Omit<Todo, 'id'> | PatchingData | null = null,
): Promise<T> {
  const options: RequestInit = { method };

  if (data) {
    options.body = JSON.stringify(data);
    options.headers = {
      'Content-Type': 'application/json; charset=UTF-8',
    };
  }

  return fetch(BASE_URL + url, options).then((response) => {
    if (!response.ok) {
      throw new Error();
    }

    return response.json();
  });
}

const client = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, data: Omit<Todo, 'id'> | null) =>
    request<T>(url, 'POST', data),
  patch: <T>(url: string, data: PatchingData) => request<T>(url, 'PATCH', data),
  delete: (url: string) => request(url, 'DELETE'),
};

export const getTodos = () => {
  return client.get<Todo[]>(`/todos`);
};

export const postTodo = (data: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, data);
};

export const patchTodo = (id: number, data: PatchingData) => {
  return client.patch<Todo>(`/todos/${id}`, data);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

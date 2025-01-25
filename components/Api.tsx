import * as SecureStore from 'expo-secure-store';

interface ResponseData {
  code: string;
}

async function get(url: string = ' ', isToken: boolean = false): Promise<Response> {
  const headers = new Headers();

  if (isToken) {
    const token = await SecureStore.getItemAsync('token');
    if (token) {
      headers.append('Authorization', `Bearer ${token}`);
    }
  }
  headers.append('Content-Type', 'application/json');

  const response = await fetch(url, {
    method: 'GET',
    headers,
  });

  // 错误处理
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('401');
    } else if (response.status === 400) {
      const errorData: ResponseData = await response.json();
      throw new Error(`${errorData.code}`);
    }
  }

  return response;
}

interface PostData {
  [key: string]: any;
}

async function post(url: string = ' ', data: PostData, isToken: boolean = false): Promise<Response> {
  const headers = new Headers();

  if (isToken) {
    const token = await SecureStore.getItemAsync('token');
    if (token) {
      headers.append('Authorization', `Bearer ${token}`);
    }
  }
  headers.append('Content-Type', 'application/json');

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });

  return response;
}

export { get, post };
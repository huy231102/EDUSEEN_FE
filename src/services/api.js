// Simple fetch wrapper cho toàn ứng dụng
// Có thể đổi sang axios sau này nhưng hiện không thêm dependency ngoài.
const BASE_URL = process.env.REACT_APP_API_URL || 'https://localhost:7256';

async function request(url, options = {}) {
  let authToken = localStorage.getItem('authToken');
  try {
    authToken = authToken ? JSON.parse(authToken) : null;
  } catch {}

  let headers = {
    'Accept': 'application/json',
    ...(options.headers || {}),
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
  };

  let body = options.body;
  // Nếu là FormData thì KHÔNG set Content-Type và KHÔNG JSON.stringify
  if (body && typeof body === 'object' && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${url}`, {
    headers,
    credentials: options.credentials || 'omit',
    ...options,
    body,
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    try {
      data = await response.text();
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    let errorText = 'Request failed';
    if (data && typeof data === 'object') {
      errorText = data.message || data.error || data.Error || JSON.stringify(data);
    } else if (typeof data === 'string') {
      errorText = data;
    }
    throw new Error(errorText);
  }

  return data;
}

export const api = {
  get: (url, options) => request(url, { method: 'GET', ...options }),
  post: (url, body, options) => request(url, { method: 'POST', body, ...options }),
  put: (url, body, options) => request(url, { method: 'PUT', body, ...options }),
  delete: (url, options) => request(url, { method: 'DELETE', ...options }),
};

export default api; 
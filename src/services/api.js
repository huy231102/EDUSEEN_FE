// Simple fetch wrapper cho toàn ứng dụng
// Có thể đổi sang axios sau này nhưng hiện không thêm dependency ngoài.
const BASE_URL = process.env.REACT_APP_API_URL || 'https://localhost:7256';

async function request(url, options = {}) {
  // Lấy token từ localStorage (nếu có) để tự động gửi trong Authorization header
  let authToken = localStorage.getItem('authToken');
  try {
    authToken = authToken ? JSON.parse(authToken) : null;
  } catch {
    // ignore parse errors, use raw value
  }

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
  };

  const response = await fetch(`${BASE_URL}${url}`, {
    headers,
    // Chỉ đính kèm cookie khi options.credentials được truyền vào
    credentials: options.credentials || 'omit',
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Request failed');
  }

  // 204 No Content
  if (response.status === 204) return null;

  return response.json();
}

export const api = {
  get: (url, options) => request(url, { method: 'GET', ...options }),
  post: (url, body, options) => request(url, { method: 'POST', body: JSON.stringify(body), ...options }),
  put: (url, body, options) => request(url, { method: 'PUT', body: JSON.stringify(body), ...options }),
  delete: (url, options) => request(url, { method: 'DELETE', ...options }),
};

export default api; 
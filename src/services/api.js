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
    'Accept': 'application/json',
    ...(options.headers || {}),
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
  };

  const response = await fetch(`${BASE_URL}${url}`, {
    headers,
    credentials: options.credentials || 'omit',
    ...options,
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    // Nếu không phải JSON, thử lấy text
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
  post: (url, body, options) => request(url, { method: 'POST', body: JSON.stringify(body), ...options }),
  put: (url, body, options) => request(url, { method: 'PUT', body: JSON.stringify(body), ...options }),
  delete: (url, options) => request(url, { method: 'DELETE', ...options }),
};

export default api; 
const API_URL = import.meta.env.VITE_API_URL;

async function request(path, options = {}) {
  const url = `${API_URL}${path}`;
  const defaultHeaders = { 'Content-Type': 'application/json' };

  const res = await fetch(url, {
    ...options,
    headers: { ...defaultHeaders, ...options.headers },
  });

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const errBody = await res.json();
      message = errBody.message || errBody.error || message;
    } catch (_) {/* ignore */}
    throw new Error(message);
  }

  // 204 No Content
  if (res.status === 204) return null;

  return res.json();
}

// ----- Donor endpoints -----

export const donorApi = {
  /** GET /donor */
  getAll: () => request('/donor'),

  /** GET /donor/{donorId} */
  getById: (donorId) => request(`/donor/${donorId}`),

  /** POST /donor */
  create: (data) => request('/donor', { method: 'POST', body: JSON.stringify(data) }),

  /** PUT /donor/{donorId} */
  update: (donorId, data) => request(`/donor/${donorId}`, { method: 'PUT', body: JSON.stringify(data) }),

  /** DELETE /donor/{donorId} */
  remove: (donorId) => request(`/donor/${donorId}`, { method: 'DELETE' }),
};

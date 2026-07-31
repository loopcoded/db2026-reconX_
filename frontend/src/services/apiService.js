// TICKET-ADV112-related — fetch wrapper that attaches Bearer JWT from sessionStorage.
const BASE = '/api';

function authHeaders() {
  const token = sessionStorage.getItem('reconx-token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(method, path, body) {
  const headers = { ...authHeaders() };
  if (body) headers['Content-Type'] = 'application/json';
  
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });
  
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      sessionStorage.removeItem('reconx-token');
      sessionStorage.removeItem('reconx-role');
      window.location.href = '/login';
    }
    throw new Error(`HTTP ${res.status}`);
  }
  if (res.status === 204) return null;
  return await res.json();
}

export const api = {
  login: (email, password)   => {
    return request('POST', '/auth/login', { email, password });
  },
  listTrades: (params = '')  => {
    // We will just use standard fetch or assuming request works
    return request('GET', `/v1/trades?${params}`);
  },
  createTrade: (req)         => {
    return request('POST', '/v1/trades', req);
  },
  updateStatus: (id, status) => {
    return request('PATCH', `/v1/trades/${id}/status`, { status });
  },
  deleteTrade: (id)          => {
    return request('DELETE', `/v1/trades/${id}`);
  },
  runRecon: (_req)            => {
    // TODO(TICKET-ADV121): POST /v1/recon/run to enqueue a recon job.
    throw new Error('TICKET-ADV121 not implemented');
  },
  reconResults: (_jobId)      => {
    // TODO(TICKET-ADV121): GET /v1/recon/jobs/{jobId}/results.
    throw new Error('TICKET-ADV121 not implemented');
  },
  audit: (_tradeRef)          => {
    // TODO(TICKET-ADV121): GET /v1/audit/trades/{tradeRef}.
    throw new Error('TICKET-ADV121 not implemented');
  },
};

// TICKET-ADV112-related — fetch wrapper that attaches Bearer JWT from sessionStorage.
const BASE = '/api';

function authHeaders() {
  const token = localStorage.getItem('jwt');
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
  
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  if (res.status === 204) return null;
  return await res.json();
}

export const api = {
  login: (_email, _password)   => {
    // TODO(TICKET-ADV072): POST /auth/login with { email, password }.
    throw new Error('TICKET-ADV072 not implemented');
  },
  listTrades: (params = '')  => {
    // We will just use standard fetch or assuming request works
    return request('GET', `/v1/trades?${params}`);
  },
  createTrade: (_req)         => {
    // TODO(TICKET-ADV123): POST /v1/trades with the form payload.
    throw new Error('TICKET-ADV123 not implemented');
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

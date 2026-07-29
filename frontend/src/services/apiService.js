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
  login: (email, password)   => {
    // TODO(TICKET-ADV072): POST /auth/login with { email, password }.
    throw new Error('TICKET-ADV072 not implemented');
  },
  listTrades: (params = '')  => {
    // We will just use standard fetch or assuming request works
    return request('GET', `/v1/trades?${params}`);
  },
  createTrade: (req)         => {
    // TODO(TICKET-ADV123): POST /v1/trades with the form payload.
    throw new Error('TICKET-ADV123 not implemented');
  },
  updateStatus: (id, status) => {
    // TODO(TICKET-ADV119): PATCH /v1/trades/{id}/status with { status }.
    throw new Error('TICKET-ADV119 not implemented');
  },
  deleteTrade: (id)          => {
    // TODO(TICKET-ADV119): DELETE /v1/trades/{id}.
    throw new Error('TICKET-ADV119 not implemented');
  },
  runRecon: (req)            => {
    // TODO(TICKET-ADV121): POST /v1/recon/run to enqueue a recon job.
    throw new Error('TICKET-ADV121 not implemented');
  },
  reconResults: (jobId)      => {
    // TODO(TICKET-ADV121): GET /v1/recon/jobs/{jobId}/results.
    throw new Error('TICKET-ADV121 not implemented');
  },
  audit: (tradeRef)          => {
    // TODO(TICKET-ADV121): GET /v1/audit/trades/{tradeRef}.
    throw new Error('TICKET-ADV121 not implemented');
  },
};

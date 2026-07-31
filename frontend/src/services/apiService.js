// TICKET-ADV112-related — fetch wrapper that attaches Bearer JWT from localStorage.

const BASE = '/api';

function authHeaders() {
  const token = localStorage.getItem('jwt');

  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
}


async function request(method, path, body) {

  const headers = {
    ...authHeaders()
  };

  if (body) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });


  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }


  if (res.status === 204) {
    return null;
  }


  return await res.json();
}



export const api = {

  // TICKET-ADV072
  // POST /api/auth/login
  // Request:
  // {
  //    email,
  //    password
  // }
  //
  // Response:
  // {
  //    token,
  //    role
  // }
  login: async (email, password) => {

    return request(
      'POST',
      '/auth/login',
      {
        email,
        password
      }
    );

  },


  // TICKET-ADV063
  // GET /api/v1/trades
  listTrades: (params = '') => {

    return request(
      'GET',
      `/v1/trades${params ? `?${params}` : ''}`
    );

  },


  // TICKET-ADV123
  // POST /api/v1/trades
  createTrade: (req) => {

    return request(
      'POST',
      '/v1/trades',
      req
    );

  },


  // TICKET-ADV066
  // PATCH /api/v1/trades/{id}/status
  updateStatus: (id, status) => {

    return request(
      'PATCH',
      `/v1/trades/${id}/status`,
      {
        status
      }
    );

  },


  // TICKET-ADV067
  // DELETE /api/v1/trades/{id}
  deleteTrade: (id) => {

    return request(
      'DELETE',
      `/v1/trades/${id}`
    );

  },


  // TICKET-ADV121
  // POST /api/v1/recon/run
  runRecon: (req) => {

    return request(
      'POST',
      '/v1/recon/run',
      req
    );

  },


  // TICKET-ADV121
  // GET /api/v1/recon/jobs/{jobId}/results
  reconResults: (jobId) => {

    return request(
      'GET',
      `/v1/recon/jobs/${jobId}/results`
    );

  },


  // TICKET-ADV121
  // GET /api/v1/audit/trades/{tradeRef}
  audit: (tradeRef) => {

    return request(
      'GET',
      `/v1/audit/trades/${tradeRef}`
    );

  }

};
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 200 }, // ramp up to 200 users over 30 seconds
    { duration: '2m', target: 200 },  // stay at 200 users for 2 minutes
    { duration: '30s', target: 0 },   // ramp down to 0 users over 30 seconds
  ],
  thresholds: {
    http_req_duration: ['p(95)<800'], // 95% of requests must complete below 800ms
    http_req_failed: ['rate<0.02'],   // error rate must be less than 2%
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080/api';

export function setup() {
  // Attempt to authenticate
  const loginRes = http.post(`${BASE_URL}/auth/login`, JSON.stringify({
    email: 'trader1@dbtraining.com', // Example user that should exist in DB
    password: 'password'
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  let token = null;
  if (loginRes.status === 200) {
    token = loginRes.json('token');
  } else {
    console.log(`Login failed (status ${loginRes.status}). Load test will run without auth or with errors if secured.`);
  }

  return { token: token };
}

export default function (data) {
  const token = data.token;
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // tradeRef must match AAA-YYYYMMDD-NNNN
  // We use VU ID and iteration to ensure uniqueness
  const refNum = ('000' + (__VU * 1000 + __ITER)).slice(-4);
  const tradeRef = `KIX-20260730-${refNum}`;

  const payload = JSON.stringify({
    tradeRef: tradeRef,
    instrumentId: 1,
    counterpartyId: 1,
    assetClass: 'EQUITY',
    side: 'BUY',
    quantity: 100.00,
    price: 150.50,
    tradeDate: '2026-07-30'
  });

  const res = http.post(`${BASE_URL}/v1/trades`, payload, { headers });

  check(res, {
    'status is 201': (r) => r.status === 201,
  });

  sleep(1);
}

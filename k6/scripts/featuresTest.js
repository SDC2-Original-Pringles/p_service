import http from 'k6/http';
import { sleep, check } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';

const randomInt = (min, max) => Math.floor(Math.random() * (max - min) + min);
const BASE_URL = 'http://localhost:3001/products';
const baseChecks = {
  'status is 200': (res) => res.status === 200,
  'content type is json': (res) =>
    res.headers['Content-Type'].includes('application/json'),
};

// export function handleSummary(data) {
//   return {
//     '../reports/summaryNewProducts1400vu5m.html': htmlReport(data),
//   };
// }

export const options = {
  stages: [
    { duration: '10s', target: 1400 },
    { duration: '5m', target: 1400 },
  ],
  thresholds: {
    http_req_duration: [{ threshold: 'p(95) < 150', abortOnFail: true }],
    http_req_failed: [{ threshold: 'rate < 0.01', abortOnFail: true }],
  },
};

export default () => {
  const currentPid = randomInt(1, 1000011);
  const currentResponse = http.get(`${BASE_URL}/${currentPid}`);
  check(currentResponse, baseChecks);
  sleep(1);
};

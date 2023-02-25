import http from 'k6/http';
import { sleep, check } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';

const randomInt = (min, max) => Math.floor(Math.random() * (max - min) + min);

// const BASE_URL = 'http://localhost:3001/products';
const BASE_URL = 'http://34.227.90.48:3001/products';

const baseChecks = {
  'status is 200': (res) => res.status === 200,
  'content type is json': (res) =>
    res.headers['Content-Type'].includes('application/json'),
};

// export function handleSummary(data) {
//   return {
//     '../reports/summary.html': htmlReport(data),
//   };
// }

export const options = {
  stages: [
    { duration: '1m', target: 500 },
    { duration: '10s', target: 600 },
    { duration: '1m', target: 600 },
    { duration: '10s', target: 700 },
    { duration: '1m', target: 700 },
  ],
  thresholds: {
    http_req_duration: [{ threshold: 'p(95) < 2000', abortOnFail: true }],
    http_req_failed: [{ threshold: 'rate < 0.01', abortOnFail: true }],
  },
};

export default () => {
  let currentPid = randomInt(900011, 1000011);
  for (let i = 0; i < randomInt(1, 5); i += 1) {
    let currentResponse = http.get(`${BASE_URL}/${currentPid}`);
    check(currentResponse, baseChecks);
    currentResponse = http.get(`${BASE_URL}/${currentPid}/styles`);
    check(currentResponse, baseChecks);
    currentResponse = http.get(`${BASE_URL}/${currentPid}/related`);
    check(currentResponse, baseChecks);
    const relatedArr = JSON.parse(currentResponse.body);
    currentPid = !relatedArr.length
      ? 1000011
      : relatedArr[randomInt(0, relatedArr.length - 1)];
    sleep(randomInt(1, 3));
  }
};

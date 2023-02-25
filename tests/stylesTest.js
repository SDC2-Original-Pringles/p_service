import http from 'k6/http';
import { sleep, check } from 'k6';

const randomInt = (min, max) => Math.floor(Math.random() * (max - min) + min);

const BASE_URL = 'http://localhost:3001/products';
// const BASE_URL = 'http://34.227.90.48:3001/products';

const baseChecks = {
  'status is 200': (res) => res.status === 200,
  'content type is json': (res) =>
    res.headers['Content-Type'].includes('application/json'),
};

export const options = {
  stages: [
    { duration: '1m', target: 2000 },
    { duration: '10m', target: 2000 },
  ],
};

export default () => {
  const currentPid = randomInt(1, 1000011);
  const currentResponse = http.get(`${BASE_URL}/${currentPid}/styles`);
  check(currentResponse, baseChecks);
  sleep(1);
};

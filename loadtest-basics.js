import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 100, 
  duration: '1s',
  sleep: 1,
};

export default function () {
  const res = http.get('http://192.168.0.104:53000/');
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}
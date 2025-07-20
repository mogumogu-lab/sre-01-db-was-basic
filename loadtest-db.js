import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 1,
  iterations: 1, 
};

const BASE_URL = 'http://192.168.0.2:53000';

export default function () {
  // 1. 대량 INSERT
  const insertRes = http.post(`${BASE_URL}/expensive/insert`, null, {
    tags: { name: 'expensive_insert' }
  });
  check(insertRes, { 'insert 200': (r) => r.status === 200 });

  // 2. 대량 SELECT
  const selectRes = http.get(`${BASE_URL}/expensive/select`, {
    tags: { name: 'expensive_select' }
  });
  check(selectRes, { 'select 200': (r) => r.status === 200 });

  // 3. 전체 DELETE (정리)
  const deleteRes = http.del(`${BASE_URL}/expensive/delete`, null, {
    tags: { name: 'expensive_delete' }
  });
  check(deleteRes, { 'delete 200': (r) => r.status === 200 });

  // (옵션) 각 단계별로 sleep 넣을 수도 있음
  // sleep(0.5);
}
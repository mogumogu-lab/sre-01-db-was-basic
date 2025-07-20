import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 50,
  duration: '30s', 
};

const BASE_URL = 'http://192.168.0.2:53000';


export default function () {
  // 1. 대량 INSERT (조금 작은 단위로, 그래도 DB 터짐)
  http.post(`${BASE_URL}/expensive/insert`, null, {
    tags: { name: 'insert' }
  });

  // 2. 대량 SELECT
  http.get(`${BASE_URL}/expensive/select`, { tags: { name: 'select' } });

  // 3. 락 경합: 같은 row update
  http.put(`${BASE_URL}/expensive/stress/1`, JSON.stringify({ name: `boom_${__VU}_${__ITER}` }),
    { headers: { 'Content-Type': 'application/json' }, tags: { name: 'stress_update' } });

  // 4. (옵션) 전체 delete
  http.del(`${BASE_URL}/expensive/delete`, null, { tags: { name: 'delete' } });

  sleep(0.1);
}
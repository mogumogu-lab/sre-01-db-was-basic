import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 100,
  duration: '30s',
};

const BASE_URL = 'http://192.168.0.2:53000'; // 환경에 맞게 수정

export default function () {
  // 1. 대량 SELECT (주요 병목 유발 대상)
  const selectRes = http.get(`${BASE_URL}/expensive/select`, {
    tags: { name: 'expensive_select' }
  });
  check(selectRes, { 'select 200': (r) => r.status === 200 });

  // (원할 경우 sleep으로 대기 조절)
  sleep(0.2);

  // 2. (선택) 전체 DELETE 부하 - 병목 후 데이터 정리용, VU별로 많이 쓰면 DB가 계속 비게 될 수 있으니 참고
  // const deleteRes = http.del(`${BASE_URL}/expensive/delete`, null, {
  //   tags: { name: 'expensive_delete' }
  // });
  // check(deleteRes, { 'delete 200': (r) => r.status === 200 });

  // 3. (참고) insert는 한 번만 수동으로 POSTMAN/curl 등으로 보내서 데이터 채워두고 진행하는 걸 추천!
}

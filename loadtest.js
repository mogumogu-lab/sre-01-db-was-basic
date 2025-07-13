import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 1000, // 가상 사용자 수
  duration: '10s',
  sleep: 1,
};

export default function () {
  // 1. POST (Create Item)
  const payload = JSON.stringify({ name: `test_${__VU}_${__ITER}` });
  const createRes = http.post('http://192.168.0.104:53000/items', payload, {
    headers: { 'Content-Type': 'application/json' },
  });
  check(createRes, { 'create 201': (r) => r.status === 201 || r.status === 200 });

  // 2. GET (List Items)
  const listRes = http.get('http://192.168.0.104:53000/items');
  check(listRes, { 'list 200': (r) => r.status === 200 });

  // 3. GET (Get Created Item)
  const item = createRes.json();
  const itemId = item.id || (item && item._id); // 상황에 따라 필드명 조정
  if (itemId) {
    const getRes = http.get(`http://192.168.0.104:53000/items/${itemId}`);
    check(getRes, { 'get 200': (r) => r.status === 200 });

    // 4. PUT (Update Item)
    const updatePayload = JSON.stringify({ name: `test_updated_${__VU}_${__ITER}` });
    const updateRes = http.put(
      `http://192.168.0.104:53000/items/${itemId}`,
      updatePayload,
      { headers: { 'Content-Type': 'application/json' } }
    );
    check(updateRes, { 'update 200': (r) => r.status === 200 });

    // 5. DELETE (Delete Item)
    // const delRes = http.del(`http://192.168.0.104:53000/items/${itemId}`);
    // check(delRes, { 'delete 200/204': (r) => r.status === 200 || r.status === 204 });
  }

  sleep(1);
}
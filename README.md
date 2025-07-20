# SRE-01 부하테스트 결과 정리

## 실험 환경

- 테스트 일시: 2025-07-20
- 서버 사양: AMD Ryzen 3500, 48GB RAM, Ubuntu 24.04
- 서비스 구성: WAS(Fastify, Node.js) + PostgreSQL(Docker)
- k6 버전: v1.1.0

## 테스트 시나리오

- VU: 1000, 2000 / Duration: 20s, 30s
- 요청 종류: CRUD (POST, GET, PUT, DELETE)
- 테스트 스크립트: [loadtest.js](./loadtest.js)

---

## 부하테스트 주요 결과

### [WAS 병목 구간]
- 1000 VU
  - avg: 20ms, p95: 40ms, max: 896ms (에러 없음)
- 2000 VU
  - avg: 460ms, p95: 830ms, max: 2.1s (에러 없음)

#### **해석**
- 1000 VU까지는 응답속도/에러율 매우 안정적
- 2000 VU 부터 avg/p95 응답속도가 0.5~0.8초로 급격히 증가 (명확한 WAS 병목 도달)

## 모니터링/판단 기준
- p95 500ms 이상: “관심 구간”, 1초 이상: “위험 구간”
- 에러율 1% 이상: 장애로 간주

## 개선점/추가실험 계획
- DB 병목 유발, 쿼리 복잡화, 대량 row 실험
- 구조: 다중 WAS, DB read replica 실험 등

## 참고 스크린샷/그래프
![k6 report](./k6-report.png)

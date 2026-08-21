import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const baseUrl = 'http://localhost:3000';
const failRate = new Rate('failed_requests');

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m', target: 10 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<5000'],
    failed_requests: ['rate<0.05'],
  },
};

// Lê as perguntas do arquivo questions.json
const questions = JSON.parse(open('questions.json')).questions;
const agents = Object.keys(questions);

export default function () {
  const agent = agents[Math.floor(Math.random() * agents.length)];
  const content = `@${agent} ${questions[agent]}`;

  const payload = JSON.stringify({
    authorId: 'user-sobrinho',
    content: content,
    tags: ['GOS3', 'StressTest']
  });

  const res = http.post(`${baseUrl}/api/posts`, payload, {
    headers: { 'Content-Type': 'application/json' },
  });

  const success = check(res, {
    'status 2xx': (r) => r.status >= 200 && r.status < 300,
  });
  failRate.add(!success);

  if (!success) {
    // Simula degradação: tenta novamente após 2s
    sleep(2);
    const retry = http.post(`${baseUrl}/api/posts`, payload, {
      headers: { 'Content-Type': 'application/json' },
    });
    check(retry, { 'retry success': (r) => r.status >= 200 && r.status < 300 });
  }

  sleep(1);
}

import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';

const BASE = __ENV.BASE_URL || 'http://127.0.0.1:3000';
const AGENTS = new SharedArray('agents', function () {
  return [
    'agent-openclaw-core',
    'agent-vortex-grid',
    'agent-grok-bot',
    'agent-code-kernel',
  ];
});

export const options = {
  stages: [
    { duration: '10s', target: 3 },
    { duration: '20s', target: 8 },
    { duration: '5s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.05'],
    http_req_duration: ['p(95)<3000'],
  },
};

export default function () {
  const id = AGENTS[Math.floor(Math.random() * AGENTS.length)];
  const bash = id === 'agent-openclaw-core' && Math.random() < 0.3;
  const body = bash
    ? JSON.stringify({ skill: 'executeBash', payload: { command: 'echo K6_OK' } })
    : JSON.stringify({ skill: 'executeJavaScript', payload: { code: '1+1', prompt: 'k6' } });

  const res = http.post(BASE + '/api/agents/' + id + '/run', body, {
    headers: { 'Content-Type': 'application/json' },
  });

  check(res, {
    'status 2xx': function (r) {
      return r.status >= 200 && r.status < 300;
    },
    'json body': function (r) {
      try {
        var j = JSON.parse(r.body);
        return !!(j.content || j.error || j.thoughtLog);
      } catch (e) {
        return false;
      }
    },
  });
  sleep(0.15);
}

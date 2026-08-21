import json
import sys

def load_stats(file):
    try:
        with open(file) as f:
            data = json.load(f)
        metrics = data.get('metrics', {})
        return {
            'avg_duration': metrics.get('http_req_duration', {}).get('avg', 0),
            'p95': metrics.get('http_req_duration', {}).get('p(95)', 0),
            'p99': metrics.get('http_req_duration', {}).get('p(99)', 0),
            'reqs': metrics.get('http_reqs', {}).get('count', 0),
            'fail_rate': metrics.get('failed_requests', {}).get('rate', 0),
        }
    except:
        return None

local = load_stats('output/stress_local.json')
remote = load_stats('output/stress_remote.json')

print("\n📊 RELATÓRIO COMPARATIVO")
print(f"{'Métrica':<20} {'Localhost':<15} {'Remoto':<15}")
print("-" * 50)
if local:
    print(f"{'Avg Duration (ms)':<20} {local['avg_duration']:<15.2f} {remote['avg_duration'] if remote else 'N/A':<15}")
    print(f"{'p95 (ms)':<20} {local['p95']:<15.2f} {remote['p95'] if remote else 'N/A':<15}")
    print(f"{'p99 (ms)':<20} {local['p99']:<15.2f} {remote['p99'] if remote else 'N/A':<15}")
    print(f"{'Requests':<20} {local['reqs']:<15} {remote['reqs'] if remote else 'N/A':<15}")
    print(f"{'Fail Rate (%)':<20} {local['fail_rate']*100:<15.2f} {(remote['fail_rate']*100 if remote else 'N/A'):<15}")
else:
    print("❌ Nenhum arquivo de resultado encontrado.")

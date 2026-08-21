import { executeRealPython } from './src/server/vortexContract';

const r = await executeRealPython('probe', 'print(42)');
console.log(JSON.stringify(r, null, 2));

import {writeFile} from 'node:fs/promises';
import {env} from 'node:process';

const out = JSON.stringify({version: env['VERSION'] || 'snapshot'}, null, 2)
console.log(`writing to buildconfig/version.json:\n${out}`)
await writeFile('buildconfig/version.json', out);

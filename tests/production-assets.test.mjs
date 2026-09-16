import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { build } from 'vite';

const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');

test('production build includes every image loaded by the game', async () => {
  const source = fs.readFileSync(new URL('../src/game/AssetManifest.js', import.meta.url), 'utf8');
  const paths = new Set([...source.matchAll(/(?:\/assets\/|\.\.\/\.\.\/assets\/)([^'"`]+\.png)/g)]
    .map((match) => match[1]).filter((name) => !name.includes('$')));
  for (const state of ['hidden', 'peek', 'watch', 'attack', 'sabotage', 'hide']) {
    paths.add('cat_hole_' + state + '.png');
  }
  assert.ok(paths.size > 30, 'must inspect the complete runtime image set');
  const result = await build({ logLevel: 'silent', build: { write: false } });
  const outputs = (Array.isArray(result) ? result : [result]).flatMap((bundle) => bundle.output);
  const emitted = new Set(outputs.filter((item) => item.type === 'asset').map((item) => hash(item.source)));
  const scripts = outputs.filter((item) => item.type === 'chunk').map((item) => item.code).join('\n');
  const missing = [...paths].filter((name) => {
    const bytes = fs.readFileSync(new URL('../assets/' + name, import.meta.url));
    return !emitted.has(hash(bytes)) && !scripts.includes('data:image/png;base64,' + bytes.toString('base64'));
  });
  assert.deepEqual(missing, [], 'runtime images missing from production build');
});

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const prototypePath = path.join(projectRoot, 'prototype', 'modular-table-cat-assembly.html');

test('assembly prototype remains a standalone HTML file', () => {
  const html = fs.readFileSync(prototypePath, 'utf8');

  assert.doesNotMatch(html, /<script\s+type=["']module["']/i);
  assert.doesNotMatch(html, /from\s+["'][^"']*src\/game\/CatRig\.js["']/);
});

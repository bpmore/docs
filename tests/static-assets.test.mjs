import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';
import test from 'node:test';

const exported = resolve('storage/app/static');
const manifest = JSON.parse(readFileSync(resolve(exported, 'build/manifest.json'), 'utf8'));

test('static export contains every Vite entry and its referenced assets', () => {
    for (const entry of Object.values(manifest)) {
        for (const file of [entry.file, ...(entry.css ?? []), ...(entry.assets ?? [])]) {
            assert.ok(existsSync(resolve(exported, 'build', file)), `Missing exported asset: ${file}`);
        }
    }
});

test('exported documentation loads both production entry points', () => {
    const html = readFileSync(resolve(exported, 'antlers/index.html'), 'utf8');
    for (const source of ['resources/css/tailwind.css', 'resources/js/app.js']) {
        assert.ok(html.includes(`/build/${manifest[source].file}`), `Missing entry point: ${source}`);
    }
    assert.ok(html.includes('type="module"'), 'Application JavaScript must run as an ES module.');
    assert.ok(!html.includes('src="/js/app.js'), 'Generated pages must not load the obsolete Mix bundle.');
});

test('all exported pages avoid the dev client and reference available build files', () => {
    const pages = readdirSync(exported, { recursive: true }).filter(file => file.endsWith('.html'));
    assert.ok(pages.length > 500, 'Generate the complete documentation before checking its assets.');
    for (const page of pages) {
        const html = readFileSync(resolve(exported, page), 'utf8');
        assert.ok(!/<script\b[^>]*\bsrc=["'][^"']*\/@vite\/client[?"']/.test(html), `Development client leaked into ${page}`);
        for (const match of html.matchAll(/(?:src|href)="[^"]*\/build\/([^"?]+)/g)) {
            assert.ok(existsSync(resolve(exported, 'build', match[1])), `${page} references missing ${match[1]}`);
        }
    }
});

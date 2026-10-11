#!/usr/bin/env node
// Troca a origem do site em todos os arquivos que a citam.
// Uso: node scripts/definir-dominio.mjs https://novodominio.com.br
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const nova = (process.argv[2] || '').replace(/\/+$/, '');
if (!/^https:\/\/[a-z0-9.-]+\.[a-z]{2,}$/i.test(nova)) {
  console.error('Informe a nova origem, ex.: node scripts/definir-dominio.mjs https://clinicabettoni.com.br');
  process.exit(1);
}
const canon = readFileSync(join(root, 'index.html'), 'utf8').match(/<link rel="canonical" href="(https:\/\/[^"/]+)\/?"/);
if (!canon) { console.error('Origem atual não encontrada no canonical de index.html.'); process.exit(1); }
const atual = canon[1];
if (atual === nova) { console.log('A origem já é', nova); process.exit(0); }
const arquivos = readdirSync(root).filter(f => /\.html$/.test(f)).concat(['sitemap.xml', 'robots.txt', 'site.webmanifest']);
let total = 0;
for (const f of arquivos) {
  const p = join(root, f);
  const s = readFileSync(p, 'utf8');
  const n = s.split(atual).length - 1;
  if (n) { writeFileSync(p, s.split(atual).join(nova)); total += n; }
  console.log(`${f}: ${n} troca(s)`);
}
console.log(`\n${atual} -> ${nova}: ${total} troca(s) no total.`);

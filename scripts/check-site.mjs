#!/usr/bin/env node
// Verificação estática do site. Sai com código 1 se encontrar problema.
// Uso: node scripts/check-site.mjs   (contraste AA via Playwright, se instalado, com o site em http://localhost:8000)
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const ORIGEM = 'https://clinica-bettoni.vercel.app';
const PAGINAS = ['index.html', 'saude-mental.html', 'ultrassonografia.html', 'doutor.html', 'clinica.html', 'convenios.html', 'conteudos.html', 'privacidade.html'];
const erros = [];
const erro = (f, m) => erros.push(`${f}: ${m}`);
const ler = f => readFileSync(join(root, f), 'utf8');
const texto = s => s.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const attr = (tag, a) => (tag.match(new RegExp(`\\s${a}="([^"]*)"`)) || [])[1];
const canonical = f => f === 'index.html' ? `${ORIGEM}/` : `${ORIGEM}/${f}`;

const todos = readdirSync(root).filter(f => f.endsWith('.html'));
const idsPorPagina = {};
const titulos = {}, descricoes = {};
const blocos = {};

for (const f of todos) {
  const s = ler(f);
  const noindex = /<meta name="robots" content="noindex"/.test(s);
  const title = (s.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
  const desc = (s.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
  if (!title) erro(f, 'sem title');
  if ([...title].length > 60) erro(f, `title com ${[...title].length} caracteres`);
  if (!desc) erro(f, 'sem description');
  if ([...desc].length > 155) erro(f, `description com ${[...desc].length} caracteres`);
  if (titulos[title]) erro(f, `title duplicado com ${titulos[title]}`); titulos[title] = f;
  if (descricoes[desc]) erro(f, `description duplicada com ${descricoes[desc]}`); descricoes[desc] = f;
  if (!noindex) {
    const can = (s.match(/<link rel="canonical" href="([^"]*)"/) || [])[1];
    if (can !== canonical(f)) erro(f, `canonical ${can} (esperado ${canonical(f)})`);
    for (const p of ['og:type', 'og:site_name', 'og:title', 'og:description', 'og:url', 'og:image', 'og:image:width', 'og:image:height', 'og:image:alt', 'og:locale'])
      if (!s.includes(`property="${p}"`)) erro(f, `falta ${p}`);
    for (const p of ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image'])
      if (!s.includes(`name="${p}"`)) erro(f, `falta ${p}`);
    if ((s.match(/property="og:url" content="([^"]*)"/) || [])[1] !== canonical(f)) erro(f, 'og:url diferente do canonical');
  }
  // URLs absolutas devem usar a origem definida
  for (const m of s.matchAll(/https:\/\/clinica[^"'\s<)]*|https:\/\/[a-z0-9-]+\.vercel\.app[^"'\s<]*/g))
    if (!m[0].startsWith(ORIGEM)) erro(f, `origem diferente: ${m[0]}`);
  const h1 = (s.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) erro(f, `${h1} h1`);
  for (const m of s.matchAll(/<(h[1-3])\b[^>]*>([\s\S]*?)<\/\1>/g)) {
    if (/<br\s*\/?>/.test(m[2])) erro(f, `<br> em ${m[1]}: ${texto(m[2])}`);
    if (!texto(m[2])) erro(f, `${m[1]} vazio`);
  }
  for (const m of s.matchAll(/<img\b[^>]*>/g)) if (attr(m[0], 'alt') === undefined) erro(f, `img sem alt: ${m[0].slice(0, 80)}`);
  const ids = [...s.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
  const dup = ids.filter((v, i) => ids.indexOf(v) !== i);
  if (dup.length) erro(f, `id duplicado: ${[...new Set(dup)]}`);
  idsPorPagina[f] = new Set(ids);
  if (/medicalSpecialty|psiquiatra|especialista/i.test(s)) erro(f, 'termo proibido pela regra CFM (medicalSpecialty / psiquiatra / especialista)');
  if (/—/.test(texto(s.replace(/<script[\s\S]*?<\/script>/g, ''))) && !['convenios.html', 'clinica.html'].includes(f)) erro(f, 'travessão em texto visível');
  // JSON-LD
  const lds = [...s.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (!noindex && lds.length !== 1) erro(f, `${lds.length} blocos JSON-LD (esperado 1)`);
  for (const ld of lds) {
    let data; try { data = JSON.parse(ld[1]); } catch (e) { erro(f, 'JSON-LD inválido'); continue; }
    const json = JSON.stringify(data);
    if (/Review|AggregateRating|"Offer"|priceRange|"geo"/.test(json)) erro(f, 'JSON-LD com tipo proibido');
    const definidos = new Set((data['@graph'] || []).map(n => n['@id']).filter(Boolean));
    const home = JSON.parse(ler('index.html').match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
    home['@graph'].forEach(n => n['@id'] && definidos.add(n['@id']));
    const walk = (o, cb) => { if (Array.isArray(o)) o.forEach(x => walk(x, cb)); else if (o && typeof o === 'object') { cb(o); Object.values(o).forEach(x => walk(x, cb)); } };
    walk(data, o => { if (o['@id'] && Object.keys(o).length === 1 && !definidos.has(o['@id'])) erro(f, `@id inexistente: ${o['@id']}`); });
    walk(data, o => Object.entries(o).forEach(([k, v]) => {
      if (['url', 'item', 'image', 'logo', 'thumbnailUrl', 'contentUrl', 'hasMap', '@id'].includes(k))
        [].concat(v).forEach(u => { if (typeof u === 'string' && !/^https:\/\//.test(u)) erro(f, `URL relativa em ${k}: ${u}`); });
    }));
    walk(data, o => {
      if (o['@type'] !== 'FAQPage') return;
      const visiveis = [...s.matchAll(/<details><summary>([\s\S]*?)<\/summary><p>([\s\S]*?)<\/p><\/details>/g)].map(m => [texto(m[1]), texto(m[2])]);
      const schema = o.mainEntity.map(q => [q.name, q.acceptedAnswer.text]);
      if (JSON.stringify(visiveis) !== JSON.stringify(schema)) erro(f, 'FAQPage diferente das perguntas visíveis');
    });
  }
  // cabeçalho e rodapé idênticos (ignorando aria-current)
  const norm = x => x.replace(/ aria-current="page"/g, '');
  const head = (s.match(/<header>[\s\S]*?<\/header>/) || [''])[0];
  const foot = (s.match(/<footer>[\s\S]*?<\/footer>/) || [''])[0];
  if (f !== '404.html') blocos[f] = norm(head) + norm(foot);
}
const ref = blocos['index.html'];
for (const [f, b] of Object.entries(blocos)) if (b !== ref) erro(f, 'cabeçalho, menu ou rodapé diferente de index.html');

// links e âncoras internas
for (const f of todos) {
  const s = ler(f);
  for (const m of s.matchAll(/\s(?:href|src|poster)="([^"]+)"/g)) {
    const u = m[1];
    if (/^(https?:|tel:|mailto:|data:)/.test(u)) continue;
    let [path, hash] = u.split('#');
    path = path.replace(/^\//, '');
    if (path === '') path = u.startsWith('/') ? 'index.html' : f;
    if (!existsSync(join(root, path))) { erro(f, `link quebrado: ${u}`); continue; }
    if (hash && path.endsWith('.html') && !idsPorPagina[path]?.has(hash)) erro(f, `âncora inexistente: ${u}`);
  }
}

// sitemap
const sm = [...ler('sitemap.xml').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
if (JSON.stringify(sm.sort()) !== JSON.stringify(PAGINAS.map(canonical).sort())) erro('sitemap.xml', 'diferente das 8 páginas');
if (!ler('robots.txt').includes(`Sitemap: ${ORIGEM}/sitemap.xml`)) erro('robots.txt', 'sem Sitemap da origem');

// contraste AA (opcional)
let pw = null;
{ const { createRequire } = await import('node:module'); const req = createRequire(import.meta.url);
  for (const c of ['playwright', '/opt/node22/lib/node_modules/playwright']) { try { pw = req(c); break; } catch {} } }
if (pw && !process.argv.includes('--sem-contraste')) {
  const { chromium } = pw.default || pw;
  try {
    const b = await chromium.launch();
    for (const [w, h] of [[390, 844], [1440, 900]]) {
      const pg = await b.newPage({ viewport: { width: w, height: h } });
      for (const f of PAGINAS) {
        await pg.goto(`http://localhost:8000/${f}?sem-intro`);
        const ruins = await pg.evaluate(() => {
          const lum = c => { const [r, g, b] = c.map(v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }); return .2126 * r + .7152 * g + .0722 * b; };
          const rgba = s => (s.match(/[\d.]+/g) || []).map(Number);
          const fundo = el => { // primeira cor sólida, misturando transparências; imagens sem cor sólida são ignoradas
            let acc = null;
            for (let e = el; e; e = e.parentElement) {
              const cs = getComputedStyle(e);
              if (cs.backgroundImage !== 'none' && !acc) return null;
              const c = rgba(cs.backgroundColor); const a = c.length > 3 ? c[3] : 1;
              if (a > 0) { if (!acc) acc = { c: c.slice(0, 3), a }; else { acc.c = acc.c.map((v, i) => v * acc.a + c[i] * (1 - acc.a)); acc.a = acc.a + a * (1 - acc.a); } if (acc.a >= .99) return acc.c; }
            }
            return acc ? acc.c.map(v => v * acc.a + 255 * (1 - acc.a)) : [255, 255, 255];
          };
          const out = [];
          for (const el of document.querySelectorAll('body *')) {
            if (![...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) continue;
            const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
            if (!r.width || cs.visibility === 'hidden' || el.closest('[hidden],#intro,dialog:not([open]),video,audio')) continue;
            const bg = fundo(el); if (!bg) continue;
            const fg = rgba(cs.color); const a = fg.length > 3 ? fg[3] : 1; const f3 = fg.slice(0, 3).map((v, i) => v * a + bg[i] * (1 - a));
            const L1 = lum(f3), L2 = lum(bg); const ratio = (Math.max(L1, L2) + .05) / (Math.min(L1, L2) + .05);
            const big = parseFloat(cs.fontSize) >= 24 || (parseFloat(cs.fontSize) >= 18.66 && +cs.fontWeight >= 700);
            if (ratio < (big ? 3 : 4.5)) out.push(`${el.tagName} "${el.textContent.trim().slice(0, 40)}" ${ratio.toFixed(2)}:1`);
          }
          return out;
        });
        ruins.forEach(r => erro(f, `contraste (${w}px): ${r}`));
      }
      await pg.close();
    }
    await b.close();
  } catch (e) { console.warn('Contraste não verificado:', e.message.split('\n')[0]); }
} else console.warn('Playwright indisponível: contraste não verificado.');

if (erros.length) { console.error(erros.map(e => '✗ ' + e).join('\n')); console.error(`\n${erros.length} problema(s).`); process.exit(1); }
console.log(`✓ ${todos.length} páginas verificadas sem problemas.`);

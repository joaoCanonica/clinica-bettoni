'use strict';
const toggle=document.querySelector('.menu-toggle'),mobile=document.querySelector('#mobile-nav');
function closeMenu(){if(!toggle)return;mobile.hidden=true;toggle.setAttribute('aria-expanded','false');}
toggle?.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';mobile.hidden=!open;toggle.setAttribute('aria-expanded',String(open));});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!mobile.hidden){closeMenu();toggle.focus();}});
window.matchMedia('(min-width:1001px)').addEventListener('change',closeMenu);
const search=document.querySelector('#plan-search');
const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
search?.addEventListener('input',()=>{const q=normalize(search.value.trim());let count=0;document.querySelectorAll('.plan').forEach(p=>{p.hidden=!normalize(p.dataset.name).includes(q);if(!p.hidden)count++;});document.querySelector('#plan-count').textContent=count===1?'1 convênio ou parceria':`${count} convênios e parcerias`;document.querySelector('.empty-plans').hidden=count>0;});
const dialog=document.querySelector('#gallery-dialog');
document.querySelectorAll('[data-gallery]').forEach(b=>b.addEventListener('click',()=>{const image=dialog.querySelector('img');image.src=b.dataset.gallery;image.alt=b.dataset.caption;dialog.querySelector('p').textContent=b.dataset.caption;dialog.showModal();}));
dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
document.querySelector('#load-map')?.addEventListener('click',()=>{const shell=document.querySelector('[data-map]');const frame=document.createElement('iframe');frame.title='Localização da Clínica Dr. Bettoni em Lages';frame.src='https://maps.google.com/maps?q=Clinica%20Dr.%20Bettoni%20Rua%20Marechal%20Deodoro%20700%20Lages%20SC&output=embed';frame.loading='lazy';frame.referrerPolicy='no-referrer-when-downgrade';const route=shell.querySelector('a');const links=document.createElement('div');links.append(route);shell.replaceChildren(frame,links);shell.classList.add('loaded');});
if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('revealed');observer.unobserve(e.target);}}),{threshold:.1});document.querySelectorAll('.intro-copy,.visit-band,.formation,.green-callout').forEach(e=>observer.observe(e));}

'use strict';
/* Tela de entrada (somente index.html; o <head> decide e põe .intro-on no <html>) */
(function(){
  const root=document.documentElement,intro=document.querySelector('#intro');
  if(!intro)return;
  if(!root.classList.contains('intro-on')){intro.remove();return;}
  const blocked=[...document.querySelectorAll('body > header, body > main, body > footer, body > .topbar, body > .skip, body > .floating-wa')];
  blocked.forEach(e=>e.inert=true);
  root.classList.add('intro-lock');
  let done=false;
  function finish(){
    if(done)return;done=true;
    blocked.forEach(e=>e.inert=false);
    root.classList.remove('intro-lock','intro-skipping');
    intro.remove();
    document.removeEventListener('keydown',onKey,true);
    const main=document.querySelector('main');
    if(main&&(!document.activeElement||document.activeElement===document.body))main.focus({preventScroll:true});
  }
  function skip(){
    if(done)return;
    root.classList.add('intro-skipping');
    // a foto do hero começa a desabrochar já, sem esperar o tempo da abertura
    document.querySelectorAll('.hero-art').forEach(el=>{el.style.animation='none';void el.offsetWidth;el.style.animation='';el.style.animationDelay='0s';});
    setTimeout(finish,400);
  }
  function onKey(e){if(['Escape','Enter',' ','Tab'].includes(e.key)){e.preventDefault();skip();}}
  intro.addEventListener('animationend',e=>{if(e.target===intro)finish();});
  intro.addEventListener('click',skip);
  document.addEventListener('keydown',onKey,true);
  // rede de segurança caso animationend não dispare
  const total=parseFloat(getComputedStyle(root).getPropertyValue('--intro-out-at'))+parseFloat(getComputedStyle(root).getPropertyValue('--intro-out-dur'));
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  setTimeout(finish,((reduced?2:total)||3.4)*1000+300);
})();

/* Menu móvel: ancorado ao cabeçalho, com foco gerenciado */
const toggle=document.querySelector('.menu-toggle'),mobile=document.querySelector('#mobile-nav');
function setMenu(open,returnFocus){
  if(!toggle||!mobile)return;
  mobile.hidden=!open;toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');
  if(open)mobile.querySelector('a')?.focus();else if(returnFocus)toggle.focus();
}
toggle?.addEventListener('click',()=>setMenu(toggle.getAttribute('aria-expanded')!=='true',true));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&mobile&&!mobile.hidden)setMenu(false,true);});
window.matchMedia('(min-width:1001px)').addEventListener('change',()=>setMenu(false,false));

/* Busca de convênios */
const search=document.querySelector('#plan-search');
const normalize=s=>s.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
search?.addEventListener('input',()=>{
  const q=normalize(search.value.trim());let count=0;
  document.querySelectorAll('.plan').forEach(p=>{p.hidden=!normalize(p.dataset.name).includes(q);if(!p.hidden)count++;});
  document.querySelector('#plan-count').textContent=count===0?'Nenhum convênio encontrado':count===1?'1 convênio ou parceria':`${count} convênios e parcerias`;
  document.querySelector('.empty-plans').hidden=count>0;
});

/* Galeria (somente onde existe o diálogo) */
const dialog=document.querySelector('#gallery-dialog');
if(dialog){
  const image=dialog.querySelector('img'),caption=dialog.querySelector('.dialog-caption'),error=dialog.querySelector('.dialog-error');
  let opener=null;
  image.addEventListener('error',()=>{error.hidden=false;image.hidden=true;});
  document.querySelectorAll('[data-gallery]').forEach(b=>b.addEventListener('click',()=>{
    opener=b;error.hidden=true;image.hidden=false;
    image.src=b.dataset.gallery;image.alt=b.dataset.alt||b.dataset.caption;caption.textContent=b.dataset.caption;
    dialog.showModal();
  }));
  dialog.addEventListener('close',()=>opener?.focus());
  dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
}

/* Mapa sob demanda */
document.querySelector('#load-map')?.addEventListener('click',()=>{const shell=document.querySelector('[data-map]');const frame=document.createElement('iframe');frame.title='Localização da Clínica Dr. Bettoni em Lages';frame.src='https://maps.google.com/maps?q=Clinica%20Dr.%20Bettoni%20Rua%20Marechal%20Deodoro%20700%20Lages%20SC&output=embed';frame.loading='lazy';frame.referrerPolicy='no-referrer-when-downgrade';const route=shell.querySelector('a');const links=document.createElement('div');links.append(route);shell.replaceChildren(frame,links);shell.classList.add('loaded');frame.focus();});

/* Revelação suave ao rolar (desligada com movimento reduzido: nada fica invisível) */
if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('revealed');observer.unobserve(e.target);}}),{threshold:.1});document.querySelectorAll('.intro-copy,.visit-band,.formation,.green-callout').forEach(e=>observer.observe(e));}

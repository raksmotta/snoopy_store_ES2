const fmtBRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
export const toBRL = v => fmtBRL.format(v);

export function fmtDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

export function getApp() {
  const app = document.getElementById('app');
  app.innerHTML = '';
  return app;
}

export function showMsg(text, type = 'error') {
  const app = document.getElementById('app');
  const old = app.querySelector('.msg');
  if (old) old.remove();
  const div = document.createElement('div');
  div.className = `msg msg-${type}`;
  div.textContent = text;
  app.prepend(div);
  setTimeout(() => div.remove(), 5000);
}

export function tipoLabel(tipo) {
  switch (tipo) {
    case 'ELETRONICO': return 'Eletr\u00f4nico';
    case 'PERECIVEL':  return 'Perec\u00edvel';
    default:           return 'B\u00e1sico';
  }
}

export function esc(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

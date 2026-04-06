import { renderProdutos } from './produtos.js';
import { renderPedidos } from './pedidos.js';

function navigate() {
  const hash = location.hash || '#/produtos';

  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', hash.startsWith(a.getAttribute('href')));
  });

  if (hash.startsWith('#/pedidos')) {
    renderPedidos(hash);
  } else {
    renderProdutos(hash);
  }
}

window.addEventListener('hashchange', navigate);
window.addEventListener('DOMContentLoaded', navigate);

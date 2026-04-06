import { api } from './api.js';
import { toBRL, fmtDate, getApp, showMsg, esc } from './ui.js';

export function renderPedidos(hash) {
  if (hash === '#/pedidos/novo') {
    renderNovoPedido();
  } else if (/^#\/pedidos\/\d+$/.test(hash)) {
    renderDetalhe(hash.split('/').pop());
  } else {
    renderHistorico();
  }
}

/* ── Hist\u00f3rico ── */

async function renderHistorico() {
  const app = getApp();
  app.innerHTML = `
    <h2>Pedidos</h2>
    <div class="toolbar">
      <div></div>
      <a href="#/pedidos/novo" class="btn">+ Novo Pedido</a>
    </div>
    <table>
      <thead><tr>
        <th>ID</th><th>Data</th><th>Valor Total</th><th>Itens</th><th>A\u00e7\u00f5es</th>
      </tr></thead>
      <tbody id="tbody"></tbody>
    </table>`;

  await carregarPedidos();
}

async function carregarPedidos() {
  try {
    const pedidos = await api.get('/pedidos');
    const tbody = document.getElementById('tbody');

    if (!pedidos.length) {
      tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Nenhum pedido encontrado.</td></tr>';
      return;
    }

    tbody.innerHTML = pedidos.map(p => `
      <tr>
        <td>${p.id}</td>
        <td>${fmtDate(p.data)}</td>
        <td>${toBRL(p.valorTotal)}</td>
        <td>${p.itens.length}</td>
        <td>
          <a href="#/pedidos/${p.id}" class="btn btn-sm">Detalhes</a>
          <button class="btn btn-sm btn-danger" data-id="${p.id}">Cancelar</button>
        </td>
      </tr>`).join('');

    tbody.querySelectorAll('[data-id]').forEach(btn => {
      btn.onclick = async () => {
        if (!confirm('Deseja cancelar este pedido?')) return;
        try {
          await api.del(`/pedidos/${btn.dataset.id}`);
          await carregarPedidos();
          showMsg('Pedido cancelado com sucesso.', 'success');
        } catch (err) { showMsg(err.message); }
      };
    });
  } catch (err) { showMsg(err.message); }
}

/* ── Detalhe ── */

async function renderDetalhe(id) {
  const app = getApp();
  try {
    const p = await api.get(`/pedidos/${id}`);
    app.innerHTML = `
      <h2>Pedido #${p.id}</h2>
      <div class="card">
        <p><strong>Data:</strong> ${fmtDate(p.data)}</p>
        <p><strong>Valor Total:</strong> ${toBRL(p.valorTotal)}</p>
        <h4 style="margin-top:1rem">Itens</h4>
        <table>
          <thead><tr><th>Produto</th><th>Pre\u00e7o Unit.</th><th>Qtd</th><th>Subtotal</th></tr></thead>
          <tbody>
            ${p.itens.map(i => `
            <tr>
              <td>${esc(i.produtoNome)}</td>
              <td>${toBRL(i.valorItem)}</td>
              <td>${i.quantidade}</td>
              <td>${toBRL(i.valorItem * i.quantidade)}</td>
            </tr>`).join('')}
          </tbody>
        </table>
        <div style="margin-top:1rem">
          <a href="#/pedidos" class="btn btn-outline">\u2190 Voltar</a>
        </div>
      </div>`;
  } catch (err) { showMsg(err.message); }
}

/* ── Novo Pedido ── */

async function renderNovoPedido() {
  const app = getApp();
  const itens = [];
  let resultados = [];

  app.innerHTML = `
    <h2>Novo Pedido</h2>

    <div class="card">
      <h4>Buscar Produto</h4>
      <div class="search-group" style="margin-top:.5rem">
        <input type="text" id="busca-prod" placeholder="Nome do produto...">
        <button class="btn" id="btn-buscar">Buscar</button>
      </div>
      <div id="resultados" style="margin-top:.75rem"></div>
    </div>

    <div id="carrinho-section" style="display:none">
      <div class="card">
        <h4>Itens do Pedido</h4>
        <table>
          <thead><tr><th>Produto</th><th>Pre\u00e7o Unit.</th><th>Qtd</th><th>Subtotal</th><th></th></tr></thead>
          <tbody id="tbody-carrinho"></tbody>
          <tfoot>
            <tr>
              <td colspan="3" class="text-right"><strong>Total:</strong></td>
              <td id="total-valor"><strong>R$ 0,00</strong></td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <div class="form-actions">
      <button class="btn btn-success" id="btn-finalizar" disabled>Finalizar Pedido</button>
      <a href="#/pedidos" class="btn btn-outline">Cancelar</a>
    </div>`;

  const buscaInput = document.getElementById('busca-prod');
  document.getElementById('btn-buscar').onclick = buscarProdutos;
  buscaInput.onkeydown = e => { if (e.key === 'Enter') buscarProdutos(); };
  document.getElementById('btn-finalizar').onclick = finalizar;

  async function buscarProdutos() {
    const q = buscaInput.value.trim();
    if (!q) return;
    try {
      resultados = await api.get(`/produtos?q=${encodeURIComponent(q)}`);
      const div = document.getElementById('resultados');

      if (!resultados.length) {
        div.innerHTML = '<p class="text-muted">Nenhum produto encontrado.</p>';
        return;
      }

      div.innerHTML = `
        <table>
          <thead><tr><th>Nome</th><th>Pre\u00e7o</th><th>Estoque</th><th></th></tr></thead>
          <tbody>
            ${resultados.map((p, i) => `
            <tr>
              <td>${esc(p.nome)}</td>
              <td>${toBRL(p.preco)}</td>
              <td>${p.estoque}</td>
              <td><button class="btn btn-sm btn-success" data-idx="${i}">Adicionar</button></td>
            </tr>`).join('')}
          </tbody>
        </table>`;

      div.querySelectorAll('[data-idx]').forEach(btn => {
        btn.onclick = () => adicionar(resultados[parseInt(btn.dataset.idx)]);
      });
    } catch (err) { showMsg(err.message); }
  }

  function adicionar(produto) {
    const existe = itens.find(i => i.produto.id === produto.id);
    if (existe) { existe.quantidade++; }
    else { itens.push({ produto, quantidade: 1 }); }
    document.getElementById('resultados').innerHTML = '';
    buscaInput.value = '';
    atualizarCarrinho();
  }

  function atualizarCarrinho() {
    const section = document.getElementById('carrinho-section');
    const tbody   = document.getElementById('tbody-carrinho');
    const btnFin  = document.getElementById('btn-finalizar');

    if (!itens.length) {
      section.style.display = 'none';
      btnFin.disabled = true;
      return;
    }

    section.style.display = '';
    btnFin.disabled = false;

    tbody.innerHTML = itens.map((item, i) => `
      <tr>
        <td>${esc(item.produto.nome)}</td>
        <td>${toBRL(item.produto.preco)}</td>
        <td><input type="number" class="qty" value="${item.quantidade}" min="1" data-idx="${i}"></td>
        <td>${toBRL(item.produto.preco * item.quantidade)}</td>
        <td><button class="btn btn-sm btn-danger" data-rem="${i}">Remover</button></td>
      </tr>`).join('');

    const total = itens.reduce((s, i) => s + i.produto.preco * i.quantidade, 0);
    document.getElementById('total-valor').innerHTML = `<strong>${toBRL(total)}</strong>`;

    tbody.querySelectorAll('input[data-idx]').forEach(input => {
      input.onchange = () => {
        const v = parseInt(input.value, 10);
        if (v > 0) itens[parseInt(input.dataset.idx)].quantidade = v;
        atualizarCarrinho();
      };
    });

    tbody.querySelectorAll('[data-rem]').forEach(btn => {
      btn.onclick = () => { itens.splice(parseInt(btn.dataset.rem), 1); atualizarCarrinho(); };
    });
  }

  async function finalizar() {
    if (!itens.length) return;
    try {
      await api.post('/pedidos', {
        itens: itens.map(i => ({ produtoId: i.produto.id, quantidade: i.quantidade }))
      });
      location.hash = '#/pedidos';
    } catch (err) { showMsg(err.message); }
  }
}

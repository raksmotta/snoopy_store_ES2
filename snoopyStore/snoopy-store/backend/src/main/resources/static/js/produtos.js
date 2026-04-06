import { api } from './api.js';
import { toBRL, getApp, showMsg, tipoLabel, esc } from './ui.js';

export function renderProdutos(hash) {
  if (hash === '#/produtos/novo') {
    renderForm();
  } else if (hash.startsWith('#/produtos/editar/')) {
    renderForm(hash.split('/').pop());
  } else {
    renderList();
  }
}

/* ── Lista ── */

async function renderList() {
  const app = getApp();
  app.innerHTML = `
    <h2>Produtos</h2>
    <div class="toolbar">
      <div class="search-group">
        <input type="text" id="busca" placeholder="Buscar por nome...">
        <button class="btn" id="btn-buscar">Buscar</button>
      </div>
      <a href="#/produtos/novo" class="btn">+ Cadastrar</a>
    </div>
    <table>
      <thead><tr>
        <th>ID</th><th>Nome</th><th>Tipo</th><th>Pre\u00e7o</th><th>Estoque</th><th>A\u00e7\u00f5es</th>
      </tr></thead>
      <tbody id="tbody"></tbody>
    </table>`;

  const busca = document.getElementById('busca');
  document.getElementById('btn-buscar').onclick = () => carregar(busca.value);
  busca.onkeydown = e => { if (e.key === 'Enter') carregar(busca.value); };
  await carregar();
}

async function carregar(q) {
  try {
    const path = q ? `/produtos?q=${encodeURIComponent(q)}` : '/produtos';
    const lista = await api.get(path);
    const tbody = document.getElementById('tbody');

    if (!lista.length) {
      tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Nenhum produto encontrado.</td></tr>';
      return;
    }

    tbody.innerHTML = lista.map(p => `
      <tr>
        <td>${p.id}</td>
        <td>${esc(p.nome)}</td>
        <td><span class="badge">${tipoLabel(p.tipo)}</span></td>
        <td>${toBRL(p.preco)}</td>
        <td>${p.estoque}</td>
        <td>
          <a href="#/produtos/editar/${p.id}" class="btn btn-sm btn-warning">Editar</a>
          <button class="btn btn-sm btn-danger" data-id="${p.id}">Excluir</button>
        </td>
      </tr>`).join('');

    tbody.querySelectorAll('[data-id]').forEach(btn => {
      btn.onclick = async () => {
        if (!confirm('Deseja realmente excluir este produto?')) return;
        try {
          await api.del(`/produtos/${btn.dataset.id}`);
          showMsg('Produto exclu\u00eddo com sucesso.', 'success');
          await carregar(document.getElementById('busca').value);
        } catch (err) { showMsg(err.message); }
      };
    });
  } catch (err) { showMsg(err.message); }
}

/* ── Formul\u00e1rio Criar / Editar ── */

async function renderForm(id) {
  const app = getApp();
  const editando = !!id;
  let produto = { tipo: 'BASICO', nome: '', preco: 0, estoque: 0, voltagem: '', dataValidade: '' };

  if (editando) {
    try { produto = await api.get(`/produtos/${id}`); }
    catch (err) { showMsg(err.message); return; }
  }

  app.innerHTML = `
    <h2>${editando ? 'Editar' : 'Cadastrar'} Produto</h2>
    <div class="card">
      <form id="form">
        ${!editando ? `
        <div class="form-group">
          <label>Tipo</label>
          <select id="tipo">
            <option value="BASICO">B\u00e1sico</option>
            <option value="ELETRONICO">Eletr\u00f4nico</option>
            <option value="PERECIVEL">Perec\u00edvel</option>
          </select>
        </div>` : ''}
        <div class="form-group">
          <label>Nome</label>
          <input type="text" id="nome" required>
        </div>
        <div class="form-group">
          <label>Pre\u00e7o (R$)</label>
          <input type="number" id="preco" min="0" step="0.01" required>
        </div>
        <div class="form-group">
          <label>Estoque</label>
          <input type="number" id="estoque" min="0" required>
        </div>
        <div class="form-group" id="grp-voltagem" style="display:none">
          <label>Voltagem</label>
          <select id="voltagem">
            <option value="">Selecione...</option>
            <option value="110">110V</option>
            <option value="220">220V</option>
            <option value="bivolt">Bivolt</option>
          </select>
        </div>
        <div class="form-group" id="grp-validade" style="display:none">
          <label>Data de Validade</label>
          <input type="date" id="dataValidade">
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-success">Salvar</button>
          <a href="#/produtos" class="btn btn-outline">Cancelar</a>
        </div>
      </form>
    </div>`;

  document.getElementById('nome').value = produto.nome;
  document.getElementById('preco').value = produto.preco;
  document.getElementById('estoque').value = produto.estoque;

  const tipoEl   = document.getElementById('tipo');
  const grpVolt   = document.getElementById('grp-voltagem');
  const grpVal    = document.getElementById('grp-validade');
  const voltEl    = document.getElementById('voltagem');
  const valEl     = document.getElementById('dataValidade');

  function updateFields() {
    const t = editando ? produto.tipo : tipoEl.value;
    grpVolt.style.display = t === 'ELETRONICO' ? '' : 'none';
    grpVal.style.display  = t === 'PERECIVEL'  ? '' : 'none';
  }

  if (tipoEl) { tipoEl.value = produto.tipo; tipoEl.onchange = updateFields; }
  if (produto.voltagem)    voltEl.value = produto.voltagem;
  if (produto.dataValidade) valEl.value = produto.dataValidade;
  updateFields();

  document.getElementById('form').onsubmit = async (e) => {
    e.preventDefault();
    const body = {
      tipo:          editando ? produto.tipo : tipoEl.value,
      nome:          document.getElementById('nome').value,
      preco:         parseFloat(document.getElementById('preco').value),
      estoque:       parseInt(document.getElementById('estoque').value, 10),
      voltagem:      voltEl.value || null,
      dataValidade:  valEl.value || null,
    };
    try {
      if (editando) await api.put(`/produtos/${id}`, body);
      else          await api.post('/produtos', body);
      location.hash = '#/produtos';
    } catch (err) { showMsg(err.message); }
  };
}

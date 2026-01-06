const API_URL = "http://127.0.0.1:5000/colaboradores";
let modal;

document.addEventListener("DOMContentLoaded", () => {
  modal = new bootstrap.Modal(document.getElementById("modalEdicao"));
});

// LISTAR (AJAX)
async function carregarColaboradores() {
  const res = await fetch(API_URL);
  const dados = await res.json();

  const tabela = document.getElementById("tabela-colaboradores");
  tabela.innerHTML = "";

  dados.forEach(c => {
    tabela.innerHTML += `
      <tr>
        <td>${c.nome_completo}</td>
        <td>${c.cargo}</td>
        <td>${c.empresa}</td>
        <td>R$ ${c.salario_atual}</td>
        <td>
          <span class="badge ${c.ativo ? 'bg-success' : 'bg-danger'}">
            ${c.ativo ? 'Ativo' : 'Inativo'}
          </span>
        </td>
        <td>
          <button class="btn btn-sm btn-warning" onclick="abrirEdicao(${c.id}, '${c.nome_completo}', '${c.cargo}', '${c.empresa}')">
            Editar
          </button>
          <button class="btn btn-sm btn-secondary" onclick="toggleStatus(${c.id})">
            Ativar/Inativar
          </button>
        </td>
      </tr>
    `;
  });
}

// ABRIR MODAL
function abrirEdicao(id, nome, cargo, empresa) {
  document.getElementById("editId").value = id;
  document.getElementById("editNome").value = nome;
  document.getElementById("editCargo").value = cargo;
  document.getElementById("editEmpresa").value = empresa;
  modal.show();
}

// SALVAR EDIÇÃO
async function salvarEdicao() {
  const id = document.getElementById("editId").value;

  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nome_completo: document.getElementById("editNome").value,
      cargo: document.getElementById("editCargo").value,
      empresa: document.getElementById("editEmpresa").value
    })
  });

  modal.hide();
  carregarColaboradores();
}

// ATIVAR / INATIVAR
async function toggleStatus(id) {
  await fetch(`${API_URL}/${id}/status`, { method: "PUT" });
  carregarColaboradores();
}
const API_URL = "http://127.0.0.1:5000/colaboradores";

let listaColaboradores = [];

// LISTAR
async function carregarColaboradores() {
  const res = await fetch(API_URL);
  listaColaboradores = await res.json();

  const tabela = document.getElementById("tabela-colaboradores");
  tabela.innerHTML = "";

  listaColaboradores.forEach(c => {
    tabela.innerHTML += `
      <tr>
        <td>${c.nome_completo}</td>
        <td>${c.re}</td>
        <td>${c.cargo}</td>
        <td>${c.empresa}</td>
        <td>R$ ${c.salario_atual}</td>
        <td>R$ ${c.salario_anterior ?? "0.00"}</td>
        <td>
          <span class="badge ${c.ativo ? 'bg-success' : 'bg-danger'}">
            ${c.ativo ? 'Ativo' : 'Inativo'}
          </span>
        </td>
        <td>
          <button class="btn btn-sm btn-warning me-1"
            onclick="abrirModalEdicao(${c.id})">
            Editar
          </button>

          <button class="btn btn-sm btn-secondary"
            onclick="alterarStatus(${c.id})">
            Ativar/Inativar
          </button>
        </td>
      </tr>
    `;
  });
}

// CADASTRAR
async function cadastrarColaborador() {
  if (!nome.value || !re.value || !cargo.value || !empresa.value || !salario.value) {
    alert("Preencha todos os campos do cadastro.");
    return;
  }

  if (salario.value <= 0) {
    alert("Salário inválido.");
    return;
  }

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nome_completo: nome.value,
      re: re.value,
      cargo: cargo.value,
      empresa: empresa.value,
      salario_atual: salario.value
    })
  });

  alert("Colaborador cadastrado com sucesso!");
  carregarColaboradores();
}

// REAJUSTE
async function reajustarSalario() {
  if (!idReajuste.value || !percentual.value) {
    alert("Informe o ID e o percentual.");
    return;
  }

  if (percentual.value < 0) {
    alert("Percentual inválido.");
    return;
  }

  if (bonus.value && Number(bonus.value) > 0) {
  const colaborador = listaColaboradores.find(
    c => c.id == idReajuste.value
  );

  if (colaborador && Number(colaborador.salario_atual) >= 1500) {
    alert("Bônus só pode ser aplicado para salários abaixo de 1500.");
    return;
  }
}

  await fetch(`${API_URL}/${idReajuste.value}/reajuste`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      percentual: percentual.value,
      bonus: bonus.value || 0
    })
  });

  alert("Reajuste aplicado!");
  carregarColaboradores();
}

// STATUS
async function alterarStatus(id) {
  await fetch(`${API_URL}/${id}/status`, { method: "PUT" });
  carregarColaboradores();
}


function abrirModalEdicao(id) {
  const c = listaColaboradores.find(col => col.id === id);

  if (!c) {
    alert("Colaborador não encontrado");
    return;
  }

  document.getElementById("editId").value = c.id;
  document.getElementById("editNome").value = c.nome_completo;
  document.getElementById("editRe").value = c.re;
  document.getElementById("editCargo").value = c.cargo;
  document.getElementById("editEmpresa").value = c.empresa;
  document.getElementById("editSalario").value = c.salario_atual;

  const modal = new bootstrap.Modal(
    document.getElementById("modalEditar")
  );
  modal.show();
}

async function salvarEdicao() {
  const id = document.getElementById("editId").value;

  const nome = document.getElementById("editNome").value;
  const re = document.getElementById("editRe").value;
  const cargo = document.getElementById("editCargo").value;
  const empresa = document.getElementById("editEmpresa").value;
  const salario = document.getElementById("editSalario").value;

  if (!nome || !re || !cargo || !empresa || !salario) {
    alert("Preencha todos os campos.");
    return;
  }

  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nome_completo: nome,
      re: re,
      cargo: cargo,
      empresa: empresa,
      salario_atual: salario
    })
  });

  alert("Colaborador atualizado!");

  bootstrap.Modal.getInstance(
    document.getElementById("modalEditar")
  ).hide();

  carregarColaboradores();
}
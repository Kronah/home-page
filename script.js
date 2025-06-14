let mobs = [];
let selectedMobs = [];

async function carregarDados() {
  try {
    const res = await fetch('https://raw.githubusercontent.com/Kronah/mob-data/refs/heads/main/dados.json');
    if (!res.ok) throw new Error('Erro ao carregar dados.json');
    mobs = await res.json();
  } catch (e) {
    console.error('Erro ao carregar dados:', e);
  }
}

function buscarMob() {
  const query = document.getElementById('searchInput').value.trim().toLowerCase();
  const resultadoDiv = document.getElementById('resultado');
  resultadoDiv.innerHTML = '';

  if (!query) {
    resultadoDiv.innerHTML = '<p>Digite algo para pesquisar.</p>';
    return;
  }

  // Procura no campo "Nome do Mob"
  const resultados = mobs.filter(mob =>
    mob["Nome do Mob"] && mob["Nome do Mob"].toLowerCase().includes(query)
  );

  if (resultados.length === 0) {
    resultadoDiv.innerHTML = '<p>Nenhum mob encontrado.</p>';
    return;
  }

  resultados.forEach(mob => {
    const mobDiv = document.createElement('div');
    mobDiv.classList.add('mob-item');
    mobDiv.innerHTML = `
      <strong>${mob["Nome do Mob"]}</strong> - Número: ${mob["Número"]} - Arquivo: ${mob["Arquivo"] || 'N/A'} 
      <button onclick="adicionarMob('${mob["Nome do Mob"]}')">Adicionar</button>
    `;
    resultadoDiv.appendChild(mobDiv);
  });
}

function adicionarMob(nome) {
  if (!selectedMobs.includes(nome)) {
    selectedMobs.push(nome);
    atualizarContador();
    mostrarListaSelecionada();
    mostrarToast(`"${nome}" adicionado à sua lista.`);
  } else {
    mostrarToast(`"${nome}" já está na sua lista.`);
  }
}

function atualizarContador() {
  document.getElementById('selectedMobCount').innerText = selectedMobs.length;
}

function mostrarListaSelecionada() {
  const listaDiv = document.getElementById('selectedMobsContent');
  listaDiv.innerHTML = '';

  if (selectedMobs.length === 0) {
    listaDiv.innerHTML = '<p class="no-items-message">Nenhum mob na sua lista ainda.</p>';
    return;
  }

  selectedMobs.forEach(nome => {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('selected-mob-item');
    itemDiv.innerHTML = `
      ${nome} <button onclick="removerMob('${nome}')">Remover</button>
    `;
    listaDiv.appendChild(itemDiv);
  });
}

function removerMob(nome) {
  selectedMobs = selectedMobs.filter(m => m !== nome);
  atualizarContador();
  mostrarListaSelecionada();
  mostrarToast(`"${nome}" removido da sua lista.`);
}

function mostrarToast(mensagem) {
  const toast = document.getElementById('toast');
  toast.innerText = mensagem;
  toast.style.visibility = 'visible';
  setTimeout(() => {
    toast.style.visibility = 'hidden';
  }, 2500);
}

function openSelectedMobsListPopup() {
  document.getElementById('selectedMobsListOverlay').style.display = 'block';
}

function closeSelectedMobsListPopup() {
  document.getElementById('selectedMobsListOverlay').style.display = 'none';
}

function setTheme(themeName) {
  document.body.className = themeName + '-theme';
}

window.onload = () => {
  carregarDados();
  atualizarContador();
  mostrarListaSelecionada();
};

let dadosMobs = [];
let selectedMobs = [];

async function carregarDados() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/Kronah/mob-data/refs/heads/main/dados.json');
        if (!response.ok) {
            throw new Error('Erro ao carregar os dados.');
        }
        dadosMobs = await response.json();
    } catch (error) {
        console.error('Erro:', error);
    }
}

function buscarMob() {
    const termo = document.getElementById('searchInput').value.trim().toLowerCase();
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = '';

    if (!termo) {
        resultadoDiv.innerHTML = '<p>Digite o nome de um mob para pesquisar.</p>';
        return;
    }

    const resultados = dadosMobs.filter(mob => mob["Nome do Mob"].toLowerCase().includes(termo));

    if (resultados.length === 0) {
        resultadoDiv.innerHTML = '<p>Nenhum mob encontrado.</p>';
        return;
    }

    resultados.forEach(mob => {
        const mobDiv = document.createElement('div');
        mobDiv.className = 'mob-result';

        mobDiv.innerHTML = `
            <p><strong>NOME:</strong> ${mob["Nome do Mob"]}</p>
            <p><strong>NÚMERO:</strong> ${mob["Número"]}</p>
            <p><strong>ARQUIVO:</strong> ${mob["Arquivo"]}</p>
            <button onclick='adicionarMobPorNumero(${mob["Número"]})'>Adicionar à Lista</button>
            <hr>
        `;

        resultadoDiv.appendChild(mobDiv);
    });
}

function adicionarMobPorNumero(numero) {
    const mob = dadosMobs.find(m => m["Número"] === numero);
    if (!mob) return;

    if (selectedMobs.some(item => item["Número"] === mob["Número"])) {
        showToast('Este mob já está na lista.');
        return;
    }

    selectedMobs.push(mob);
    atualizarListaSelecionados();
    showToast('Mob adicionado à lista!');
}

function atualizarListaSelecionados() {
    const contentDiv = document.getElementById('selectedMobsContent');
    contentDiv.innerHTML = '';

    if (selectedMobs.length === 0) {
        contentDiv.innerHTML = '<p class="no-items-message">Nenhum mob na sua lista ainda.</p>';
        document.getElementById('selectedMobCount').innerText = '0';
        return;
    }

    selectedMobs.forEach(mob => {
        const mobDiv = document.createElement('div');
        mobDiv.className = 'mob-list-item';

        mobDiv.innerHTML = `
            <p><strong>NOME:</strong> ${mob["Nome do Mob"]}</p>
            <p><strong>NÚMERO:</strong> ${mob["Número"]}</p>
            <p><strong>ARQUIVO:</strong> ${mob["Arquivo"]}</p>
            <button onclick='removerMob(${mob["Número"]})'>Remover</button>
            <hr>
        `;

        contentDiv.appendChild(mobDiv);
    });

    document.getElementById('selectedMobCount').innerText = selectedMobs.length;
}

function removerMob(numero) {
    selectedMobs = selectedMobs.filter(item => item["Número"] !== numero);
    atualizarListaSelecionados();
    showToast('Mob removido da lista.');
}

function openSelectedMobsListPopup() {
    document.getElementById('selectedMobsListOverlay').style.display = 'block';
}

function closeSelectedMobsListPopup() {
    document.getElementById('selectedMobsListOverlay').style.display = 'none';
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.innerText = message;
    toast.style.visibility = 'visible';
    setTimeout(() => {
        toast.style.visibility = 'hidden';
    }, 2000);
}

window.onload = carregarDados;

const MOB_DATA_URL = 'https://raw.githubusercontent.com/Kronah/mob-data/refs/heads/main/dados.json';
let allMobsData = []; // Variável para armazenar os dados dos mobs uma vez carregados
let selectedMobs = []; // Nova variável para armazenar os mobs selecionados

// Função para mostrar toasts
function mostrarToast(mensagem, tipo = "success") {
    const toast = document.getElementById("toast");
    if (toast) {
        toast.className = "show";
        toast.className = `show ${tipo}`;
        toast.innerText = mensagem;

        setTimeout(() => {
            toast.className = toast.className.replace("show", "");
        }, 3000);
    } else {
        console.warn("Elemento Toast não encontrado. Mensagem:", mensagem);
        if (tipo === "error") {
            console.error(mensagem);
        } else {
            console.log(mensagem);
        }
    }
}

// Função para carregar os dados dos mobs do GitHub
async function loadMobsData() {
    const loadingSpinner = document.getElementById('loadingSpinner');
    const resultadoDiv = document.getElementById('resultado'); 
    
    if (resultadoDiv) {
        resultadoDiv.innerHTML = '<h3>Resultados da Pesquisa:</h3><div id="loadingSpinner" class="spinner" style="display: block;"></div><p class="no-results">Carregando dados dos Mobs...</p>';
    }
    if (loadingSpinner) {
        loadingSpinner.style.display = 'block'; 
    }
    console.log("Iniciando carregamento dos dados dos Mobs...");
    console.log("Tentando carregar de:", MOB_DATA_URL);

    try {
        const response = await fetch(MOB_DATA_URL);
        console.log("Resposta da requisição para dados.json:", response);

        if (!response.ok) {
            throw new Error(`Erro HTTP ao carregar dados: ${response.status} ${response.statusText}`);
        }
        
        allMobsData = await response.json();
        console.log("Dados dos Mobs carregados com sucesso:", allMobsData);
        console.log("Número de Mobs carregados:", allMobsData.length);

        mostrarToast("Dados dos Mobs carregados com sucesso!", "success");
        if (resultadoDiv) {
            resultadoDiv.innerHTML = '<h3>Resultados da Pesquisa:</h3><p class="no-results">Nenhum resultado para exibir ainda. Digite um nome e clique em buscar.</p>';
        }
    } catch (error) {
        console.error("Erro FATAL ao carregar dados dos Mobs:", error);
        mostrarToast(`Erro ao carregar dados: ${error.message}. Verifique o console.`, "error");
        if (resultadoDiv) {
            resultadoDiv.innerHTML = '<h3>Resultados da Pesquisa:</h3><p class="no-results" style="color: var(--error-red);">Erro ao carregar dados dos Mobs. Por favor, verifique sua conexão ou o link do arquivo.</p>';
        }
    } finally {
        if (loadingSpinner) {
            loadingSpinner.style.display = 'none'; 
        }
        console.log("Carregamento dos dados dos Mobs finalizado.");
    }
}

// Funções para gerenciar a lista de mobs selecionados
function loadSelectedMobs() {
    const storedMobs = localStorage.getItem('selectedMobs');
    if (storedMobs) {
        selectedMobs = JSON.parse(storedMobs);
    }
    updateSelectedMobCount();
    console.log("Mobs selecionados carregados:", selectedMobs);
}

function saveSelectedMobs() {
    localStorage.setItem('selectedMobs', JSON.stringify(selectedMobs));
    updateSelectedMobCount();
    console.log("Mobs selecionados salvos:", selectedMobs);
}

function updateSelectedMobCount() {
    const countSpan = document.getElementById('selectedMobCount');
    if (countSpan) {
        countSpan.innerText = selectedMobs.length;
    }
}

function isMobSelected(mobNumber) {
    const selected = selectedMobs.some(mob => mob["Número"] === mobNumber);
    // console.log(`Mob Number ${mobNumber} is selected: ${selected}`); // Log para depuração
    return selected;
}

function addMobToList(mob) {
    if (!isMobSelected(mob["Número"])) {
        selectedMobs.push(mob);
        saveSelectedMobs();
        mostrarToast(`"${mob["Nome do Mob"]}" adicionado à lista!`, "success");
        // Re-executa a busca para atualizar botões (necessário para mudar + para -)
        buscarMob(document.getElementById('searchInput').value.trim()); 
        displaySelectedMobs(); // Atualiza a lista no popup se estiver aberto
    } else {
        mostrarToast(`"${mob["Nome do Mob"]}" já está na lista.`, "info");
    }
}

function removeMobFromList(mobNumber) {
    const initialLength = selectedMobs.length;
    selectedMobs = selectedMobs.filter(mob => mob["Número"] !== mobNumber);
    if (selectedMobs.length < initialLength) {
        saveSelectedMobs();
        mostrarToast("Mob removido da lista.", "success");
        // Re-executa a busca para atualizar botões (necessário para mudar - para +)
        buscarMob(document.getElementById('searchInput').value.trim()); 
        displaySelectedMobs(); // Atualiza a lista no popup se estiver aberto
    }
}

// Funções para controlar o popup da lista
function openSelectedMobsListPopup() {
    const overlay = document.getElementById('selectedMobsListOverlay');
    if (overlay) {
        overlay.style.display = 'flex'; 
        displaySelectedMobs(); 
    }
}

function closeSelectedMobsListPopup() {
    const overlay = document.getElementById('selectedMobsListOverlay');
    if (overlay) {
        overlay.style.display = 'none'; 
    }
}

// Função para exibir os mobs selecionados dentro do popup
function displaySelectedMobs() {
    const contentDiv = document.getElementById('selectedMobsContent');
    if (!contentDiv) return;

    contentDiv.innerHTML = ''; 

    if (selectedMobs.length === 0) {
        contentDiv.innerHTML = '<p class="no-items-message">Nenhum mob na sua lista ainda.</p>';
        return;
    }

    selectedMobs.forEach(mob => {
        const mobItem = document.createElement('div');
        mobItem.className = 'mob-item-list';
        mobItem.innerHTML = `
            <span>${mob["Nome do Mob"] || 'N/A'}</span>
            <button class="remove-button" onclick="removeMobFromList(${mob["Número"]})">
                <i class="fas fa-minus"></i>
            </button>
        `;
        contentDiv.appendChild(mobItem);
    });
}


// Função para buscar Mob
async function buscarMob(initialTerm = null) { 
    const searchInput = document.getElementById('searchInput');
    const termo = (initialTerm !== null) ? initialTerm.toLowerCase() : searchInput.value.trim().toLowerCase();
    const resultado = document.getElementById('resultado');
    const loadingSpinner = document.getElementById('loadingSpinner');

    resultado.innerHTML = '<h3>Resultados da Pesquisa:</h3>'; 

    if (!termo) {
        resultado.innerHTML += '<p class="no-results">Por favor, digite um nome de Mob para buscar.</p>';
        mostrarToast("Por favor, digite um nome para buscar.", "info");
        return;
    }

    if (allMobsData.length === 0) {
        resultado.innerHTML += '<p class="no-results">Dados dos Mobs ainda não carregados. Por favor, aguarde ou tente recarregar a página.</p>';
        mostrarToast("Dados dos Mobs não carregados. Aguarde ou recarregue.", "info");
        return;
    }

    if (loadingSpinner) {
        loadingSpinner.style.display = 'block'; 
    }
    mostrarToast(`Buscando por "${termo}"...`, "info");

    const foundMobs = allMobsData.filter(mob => 
        mob["Nome do Mob"] && mob["Nome do Mob"].toLowerCase().includes(termo) 
    );

    console.log("Found Mobs for term '" + termo + "':", foundMobs); // Log dos mobs encontrados

    await new Promise(resolve => setTimeout(resolve, 500)); 

    if (loadingSpinner) {
        loadingSpinner.style.display = 'none'; 
    }

    if (foundMobs.length > 0) {
        foundMobs.forEach(mob => {
            const isSelected = isMobSelected(mob["Número"]);
            console.log(`Processing mob: ${mob["Nome do Mob"]}, Number: ${mob["Número"]}, Is Selected: ${isSelected}`); // Log de depuração

            // Gera o HTML do botão com base no status de seleção
            const buttonHtml = isSelected
                ? `<button class="remove-button" onclick="removeMobFromList(${mob["Número"]})"><i class="fas fa-minus"></i></button>`
                : `<button class="add-button" onclick="addMobToList(${JSON.stringify(mob).replace(/"/g, '&quot;')})"><i class="fas fa-plus"></i></button>`;

            const mobHtml = `
                <div class="mob-result-item">
                    <div>
                        <p><strong>Número:</strong> ${mob["Número"] !== null ? mob["Número"] : 'N/A'}</p>
                        <p><strong>Nome do Mob:</strong> ${mob["Nome do Mob"] || 'N/A'}</p>
                        <p><strong>Pontos:</strong> ${mob["Pontos"] !== null ? mob["Pontos"] : 'N/A'}</p>
                        <p><strong>Arquivo:</strong> ${mob["Arquivo"] || 'N/A'}</p>
                    </div>
                    <div class="action-buttons">
                        ${buttonHtml}
                    </div>
                </div>
                <hr style="border-color: var(--border-color); margin: 10px 0;">
            `;
            console.log("Generated HTML for mob:", mobHtml); // Loga o HTML gerado para cada mob

            resultado.innerHTML += mobHtml;
        });
        mostrarToast(`Encontrados ${foundMobs.length} Mob(s)!`, "success");
    } else {
        resultado.innerHTML += '<p class="no-results">Nenhum Mob encontrado com esse nome.</p>';
        mostrarToast("Nenhum Mob encontrado.", "error");
    }
}


// Ao carregar a página, carrega os dados dos mobs e a lista de selecionados
window.onload = async () => {
    loadSelectedMobs(); // Carrega a lista de mobs selecionados do localStorage
    await loadMobsData(); // Carrega os dados dos mobs do GitHub
};


const MOB_DATA_URL = 'https://raw.githubusercontent.com/Kronah/mob-data/refs/heads/main/dados.json';
let allMobsData = []; // Variável para armazenar os dados dos mobs uma vez carregados

// Função para mostrar toasts (adaptada para o seu contexto)
function mostrarToast(mensagem, tipo = "success") {
    // Se você tiver um elemento toast no seu index.html, ele será usado.
    // Caso contrário, a mensagem será apenas logada no console.
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
        // Fallback simples para o console se o toast não existir
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

    try {
        const response = await fetch(MOB_DATA_URL);
        console.log("Resposta da requisição para data.json:", response);

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
            loadingSpinner.style.display = 'none'; // Esconde o spinner
        }
        console.log("Carregamento dos dados dos Mobs finalizado.");
    }
}

// Função para buscar Mob
async function buscarMob() { 
    const searchInput = document.getElementById('searchInput'); 
    const termo = searchInput.value.trim().toLowerCase(); 
    const resultado = document.getElementById('resultado'); 
    const loadingSpinner = document.getElementById('loadingSpinner');

    resultado.innerHTML = '<h3>Resultados da Pesquisa:</h3>'; // Limpa resultados anteriores

    if (!termo) {
        resultado.innerHTML += '<p class="no-results">Por favor, digite um nome de Mob para buscar.</p>';
        mostrarToast("Por favor, digite um nome para buscar.", "info"); // Mensagem mais específica
        return;
    }

    if (allMobsData.length === 0) {
        resultado.innerHTML += '<p class="no-results">Dados dos Mobs ainda não carregados. Por favor, aguarde ou tente recarregar a página.</p>';
        mostrarToast("Dados dos Mobs não carregados. Aguarde ou recarregue.", "info"); // Mensagem mais específica
        return;
    }

    if (loadingSpinner) {
        loadingSpinner.style.display = 'block'; // Mostra o spinner durante a busca
    }
    mostrarToast(`Buscando por "${termo}"...`, "info");

    // Filtra os mobs carregados
    const foundMobs = allMobsData.filter(mob => 
        mob["Nome do Mob"] && mob["Nome do Mob"].toLowerCase().includes(termo) 
    );

    // Simula um pequeno atraso para a experiência do usuário
    await new Promise(resolve => setTimeout(resolve, 500)); 

    if (loadingSpinner) {
        loadingSpinner.style.display = 'none'; // Esconde o spinner após a busca
    }

    if (foundMobs.length > 0) {
        foundMobs.forEach(mob => {
            resultado.innerHTML += `
                <p><strong>Número:</strong> ${mob["Número"] !== null ? mob["Número"] : 'N/A'}</p>
                <p><strong>Nome do Mob:</strong> ${mob["Nome do Mob"] || 'N/A'}</p>
                <p><strong>Pontos:</strong> ${mob["Pontos"] !== null ? mob["Pontos"] : 'N/A'}</p>
                <p><strong>Arquivo:</strong> ${mob["Arquivo"] || 'N/A'}</p>
                <hr style="border-color: var(--border-color); margin: 10px 0;">
            `;
        });
        mostrarToast(`Encontrados ${foundMobs.length} Mob(s)!`, "success");
    } else {
        resultado.innerHTML += '<p class="no-results">Nenhum Mob encontrado com esse nome.</p>';
        mostrarToast("Nenhum Mob encontrado.", "error");
    }
}

// Ao carregar a página, carrega os dados dos mobs
window.onload = async () => {
    await loadMobsData(); 
};


let dadosCache = null;

async function carregarDados() {
    if (dadosCache) return dadosCache; // retorna cache se já tiver carregado
    const resposta = await fetch("https://raw.githubusercontent.com/Kronah/mob-data/refs/heads/main/dados.json");
    const dados = await resposta.json();
    dadosCache = dados; // salva no cache
    return dados;
}

async function buscarMob() {
    const termo = document.getElementById("searchInput").value.toLowerCase();
    let resultados = [];
    try {
        const dados = await carregarDados();

        for (let mob of dados) {
            if (mob["Nome do Mob"].toLowerCase().includes(termo)) {
                resultados.push(
                    `<strong>${mob["Nome do Mob"]}</strong><br>Número: ${mob["Número"]}<br>Boss: ${mob["Arquivo"]}<br><br>`
                );
            }
        }

        document.getElementById("resultado").innerHTML =
            resultados.length > 0
                ? resultados.join("")
                : "Nenhum mob encontrado.";
    } catch (e) {
        document.getElementById("resultado").innerHTML = "Erro ao carregar os dados online.";
        console.error(e);
    }
}

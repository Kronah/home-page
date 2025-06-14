function buscarMob() {
    const termoBusca = document.getElementById('searchInput').value.toLowerCase();
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = '';

    if (!termoBusca.trim()) {
        resultadoDiv.innerHTML = '<p>Por favor, digite um termo de busca.</p>';
        return;
    }

    fetch('https://raw.githubusercontent.com/Kronah/mob-data/refs/heads/main/dados.json')
        .then(response => response.json())
        .then(data => {
            const resultados = data.filter(mob => mob['Nome do Mob'].toLowerCase().includes(termoBusca));
            
            if (resultados.length === 0) {
                resultadoDiv.innerHTML = '<p>Nenhum mob encontrado.</p>';
                return;
            }

            resultados.forEach(mob => {
                const mobDiv = document.createElement('div');
                mobDiv.className = 'mob-result';

                mobDiv.innerHTML = `
                    <strong>${mob['Nome do Mob']}</strong><br>
                    Número: ${mob['Número']}<br>
                    Arquivo: ${mob['Arquivo']}<br>
                    Pontos: ${mob['Pontos'] !== null ? mob['Pontos'] : '-'}
                `;
                
                const addButton = document.createElement('button');
                addButton.textContent = 'Adicionar à Lista';
                addButton.onclick = () => adicionarMob(mob);
                mobDiv.appendChild(addButton);

                resultadoDiv.appendChild(mobDiv);
            });
        })
        .catch(error => {
            console.error('Erro ao buscar mob:', error);
            resultadoDiv.innerHTML = '<p>Erro ao carregar os dados dos mobs.</p>';
        });
}

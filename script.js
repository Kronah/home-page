function verificarToken() {
    const inputToken = document.getElementById('tokenInput').value.trim();
    const mensagem = document.getElementById('loginMessage');

    fetch(`https://bossdv-72d16-default-rtdb.firebaseio.com/tokens/${inputToken}.json`)
        .then(response => response.json())
        .then(data => {
            if (data && data.valid === true) {
                document.getElementById('login-screen').style.display = 'none';
                document.getElementById('main-content').style.display = 'block';
                console.log('Bem-vindo, ' + data.nome);
            } else {
                mensagem.textContent = 'Token inválido ou expirado!';
            }
        })
        .catch(error => {
            console.error('Erro ao acessar Firebase:', error);
            mensagem.textContent = 'Erro de conexão com o servidor!';
        });
}

function buscarMob() {
    const termo = document.getElementById('searchInput').value.trim().toLowerCase();
    const resultado = document.getElementById('resultado');

    if (!termo) {
        resultado.innerHTML = "<p>Por favor, digite um nome para buscar.</p>";
        return;
    }

    resultado.innerHTML = `<p>Resultados encontrados para: <strong>${termo}</strong></p>`;
}

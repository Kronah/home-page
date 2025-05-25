function buscarMob() {
    const termo = document.getElementById('searchInput').value.trim().toLowerCase();
    const resultado = document.getElementById('resultado');

    if (!termo) {
        resultado.innerHTML = "<p>Por favor, digite um nome para buscar.</p>";
        return;
    }

    // Simulação de resultado
    resultado.innerHTML = `<p>Resultados encontrados para: <strong>${termo}</strong></p>`;
}

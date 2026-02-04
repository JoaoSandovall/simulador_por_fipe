let tsMarca, tsModelo, tsAno;

function inicializarBuscadores() {
    tsMarca = new TomSelect("#select-marca", {
        valueField: 'codigo',
        labelField: 'nome',
        searchField: 'nome',
        placeholder: "Digite a marca...",
        disable: true,
        onChange: carregarModelos
    });

    tsModelo = new TomSelect("#select-modelo", {
        valueField: 'codigo',
        labelField: 'nome',
        searchField: 'nome',
        placeholder: "Digite o modelo...",
        disable: true,
        onChange: carregarAnos
    });

    tsAno = new TomSelect("#select-ano", {
        labelField: 'nome',
        searchField: 'nome',
        placeholder: "Digite o ano...",
        disable: true,
        onChange: exibirApenasPreco
    });
}

async function carregarMarcas() {
    const res = await fetch('/marcas');
    const marcas = await res.json();
    
    tsMarca.clearOptions();
    tsMarca.addOptions(marcas);
}

async function carregarModelos() {

    if (!marcaId) return;

    const res = await fetch(`/marcas/${marcaId}/modelos`);
    const dados = await res.json();

    tsModelo.clearOptions();
    tsModelo.addOptions(dados.modelos);
    tsModelo.enable();
}

async function carregarAnos() {
    const marcaId = tsMarca.getValue();
    if (!modeloId || !marcaId) return;

    const res = await fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${marcaId}/modelos/${modeloId}/anos`);
    const anos = await res.json();

    tsAno.clearOptions();
    tsAno.addOptions();
    tsAno.enable();
}

async function exibirApenasPreco() {
    const marcaId = document.getElementById('select-marca').value;
    const modeloId = document.getElementById('select-modelo').value;
    const anoId = document.getElementById('select-ano').value;

    if (!anoId) return;

    const res = await fetch(`/valor/${marcaId}/${modeloId}/${anoId}`);
    const data = await res.json();

    const divRes = document.getElementById('resultado');
    divRes.classList.remove('hidden');
    
    document.getElementById('res-carro').innerText = `${data.carro} (${data.ano})`;
    document.getElementById('res-preco').innerText = data.preco_tabela;
    document.getElementById('res-parcela').innerText = "Clique em simular para ver as parcelas";
}

async function buscarResultado() {
    const marcaId = document.getElementById('select-marca').value;
    const modeloId = document.getElementById('select-modelo').value;
    const anoId = document.getElementById('select-ano').value;
    const entrada = document.getElementById('input-entrada').value || 0;
    const juros = document.getElementById('input-juros').value || 1.5;

    if (!anoId) {
        alert("Por favor, selecione o carro completo primeiro!");
        return;
    }

    const res = await fetch(`/valor/${marcaId}/${modeloId}/${anoId}?entrada=${entrada}&juros=${juros}`);
    const data = await res.json();

    if (data.erro) {
        alert(data.erro);
        return;
    }
    
    document.getElementById('res-parcela').innerText = data.simulacao_48x.parcela;
}

document.addEventListener('DOMContentLoaded', () => {
    inicializarBuscadores();
    carregarMarcas();
})
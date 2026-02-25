let tsMarca, tsModelo, tsAno;

function inicializarBuscadores() {
    tsMarca = new TomSelect("#select-marca", {
        valueField: 'codigo',
        labelField: 'nome',
        searchField: 'nome',
        placeholder: "Digite a marca...",
        disabled: true,
        onChange: carregarModelos
    });

    tsModelo = new TomSelect("#select-modelo", {
        valueField: 'codigo',
        labelField: 'nome',
        searchField: 'nome',
        placeholder: "Digite o modelo...",
        disabled: true,
        onChange: carregarAnos
    });

    tsAno = new TomSelect("#select-ano", {
        valueField: 'codigo',
        labelField: 'nome',
        searchField: 'nome',
        placeholder: "Digite o ano...",
        disabled: true,
        onChange: exibirApenasPreco
    });
}

async function carregarMarcas() {
    const res = await fetch('/marcas');
    const marcas = await res.json();
    
    tsMarca.clearOptions();
    tsMarca.addOptions(marcas);
}

async function carregarModelos(marcaId) {

    if (!marcaId) return;

    tsModelo.clear();
    tsAno.clear();
    tsAno.clearOptions();
    tsAno.disable();
    tsModelo.clearOptions();

    const res = await fetch(`/marcas/${marcaId}/modelos`);
    const dados = await res.json();

    tsModelo.clearOptions();
    tsModelo.addOptions(dados.modelos);
    tsModelo.enable();
}

async function carregarAnos(modeloId) {
    const marcaId = tsMarca.getValue();
    if (!modeloId || !marcaId) return;

    tsAno.clear();
    tsAno.clearOptions();

    const res = await fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${marcaId}/modelos/${modeloId}/anos`);
    const anos = await res.json();

    tsAno.clearOptions();
    tsAno.addOptions(anos);
    tsAno.enable();
}

async function exibirApenasPreco() {
    const marcaId = tsMarca.getValue();
    const modeloId = tsModelo.getValue();
    const anoId = tsAno.getValue();

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
    const marcaId = tsMarca.getValue();
    const modeloId = tsModelo.getValue();
    const anoId = tsAno.getValue();
    const entrada = document.getElementById('input-entrada').value || 0;
    const juros = document.getElementById('input-juros').value || 1.5;
    const parcelas = document.getElementById('input-parcelas').value;

    if (!anoId) {
        alert("Por favor, selecione o carro completo primeiro!");
        return;
    }

    const res = await fetch(`/valor/${marcaId}/${modeloId}/${anoId}?entrada=${entrada}&juros=${juros}&meses=${parcelas}`);
    const data = await res.json();

    if (data.erro) {
        alert(data.erro);
        return;
    }
    
    document.getElementById('res-carro').innerText = `${data.carro} (${data.ano})`;
    document.getElementById('res-preco').innerText = data.preco_tabela;
    document.getElementById('res-parcela').innerText = data.simulacao.parcela;
    document.getElementById('res-juros-total').innerText = data.simulacao.total_juros;
    document.getElementById('res-total-geral').innerText = data.simulacao.total_pago;
}


document.addEventListener('DOMContentLoaded', () => {
    inicializarBuscadores();
    carregarMarcas();
})
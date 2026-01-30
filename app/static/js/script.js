async function carregarMarcas() {
    const res = await fetch('/marcas');
    const marcas = await res.json();
    const select = document.getElementById('select-marca');

    marcas.forEach(m => {
        const option = document.createElement('option');
        option.value = m.codigo;
        option.textContent = m.nome;
        select.appendChild(option);
    });
}

async function carregarModelos() {
    const marcaId = document.getElementById('select-marca').value;
    const select = document.getElementById('select-modelo');
    
    if (!marcaId) return;

    select.disabled = true;
    select.innerHTML = '<option>Carregando modelos...</option>';

    const res = await fetch(`/marcas/${marcaId}/modelos`);
    const dados = await res.json();

    select.innerHTML = '<option value="">Selecione o modelo...</option>';
    dados.modelos.forEach(m => {
        const option = document.createElement('option');
        option.value = m.codigo;
        option.textContent = m.nome;
        select.appendChild(option);
    });
    select.disabled = false;
}

async function carregarAnos() {
    const marcaId = document.getElementById('select-marca').value;
    const modeloId = document.getElementById('select-modelo').value;
    const select = document.getElementById('select-ano');

    select.disabled = true;
    const res = await fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${marcaId}/modelos/${modeloId}/anos`);
    const anos = await res.json();

    select.innerHTML = '<option value="">Selecione o ano...</option>';
    anos.forEach(a => {
        const option = document.createElement('option');
        option.value = a.codigo;
        option.textContent = a.nome;
        select.appendChild(option);
    });
    select.disabled = false;
}

async function buscarResultado() {
    const marcaId = document.getElementById('select-marca').value;
    const modeloId = document.getElementById('select-modelo').value;
    const anoId = document.getElementById('select-ano').value;
    const entrada = document.getElementById('input-entrada').value || 0;
    const juros = document.getElementById('input-juros').value || 1.5;

    if (!anoid) {
        alert("Por favor, selecione o carro completo primeiro!");
        return;
    }

    const res = await fetch(`/valor/${marcaId}/${modeloId}/${anoId}?entrada=${entrada}&juros=${juros}`);
    const data = await res.json();

    if (data.erro) {
        alert(data.erro);
        return;
    }
    
    const divRes = document.getElementById('resultado');
    divRes.classList.remove('hidden');
    
    document.getElementById('res-carro').innerText = `${data.carro} (${data.ano})`;
    document.getElementById('res-preco').innerText = data.preco_tabela;
    document.getElementById('res-parcela').innerText = data.simulacao_48x.parcela;
}

// Inicia o app
document.addEventListener('DOMContentLoaded', carregarMarcas);
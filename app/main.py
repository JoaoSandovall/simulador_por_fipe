from flask import Flask, jsonify, request, render_template
import requests

app = Flask(__name__)

BASE_URL = "https://parallelum.com.br/fipe/api/v1/carros/marcas"

@app.route('/')
def home():
    return render_template("index.html")

# 1. Lista de marcas 
@app.route('/marcas')
def get_marcas():
    try:
        response = requests.get(BASE_URL)
        return jsonify(response.json())
    except Exception as e:
        return jsonify({"erro": str(e)}), 500

# 2. Lista de Modelos de uma Marca
@app.route('/marcas/<marca_id>/modelos')
def get_modelos(marca_id):
    url = f"{BASE_URL}/{marca_id}/modelos"
    return jsonify(requests.get(url).json())

@app.route('/valor/<marca_id>/<modelo_id>/<ano_id>')
def get_valor(marca_id, modelo_id, ano_id):

    entrada_usuario = float(request.args.get('entrada', 0))
    taxa_usuario = float(request.args.get('juros', 1.5)) / 100
    meses = int(request.args.get('meses', 48))
    url = f"{BASE_URL}/{marca_id}/modelos/{modelo_id}/anos/{ano_id}"

    response = requests.get(url)
    dados_fipe = response.json()

    valor_raw = dados_fipe.get('Valor', '0')
    valor_limpo = valor_raw.replace('R$ ', '').replace('.', '').replace(',', '.')
    valor_total = float(valor_limpo)

    if entrada_usuario >= valor_total and entrada_usuario > 0:
        return jsonify({"erro": "A entrada não pode ser maior que o valor do carro!"}), 400

    valor_financiado = valor_total - entrada_usuario
    meses = 48

    if valor_financiado > 0:
        parcela = valor_financiado * (taxa_usuario * (1 + taxa_usuario)**meses) / ((1 + taxa_usuario)**meses - 1)
        
        total_pago_financiamento = parcela * meses
        juros_total = total_pago_financiamento - valor_financiado
        total_geral = total_pago_financiamento + entrada_usuario

    else:
        parcela = 0
        juros_total = 0
        total_geral = valor_total

    return jsonify({
    "carro": f"{dados_fipe['Marca']} {dados_fipe['Modelo']}",
    "ano": dados_fipe['AnoModelo'],
    "preco_tabela": valor_raw,
    "simulacao": {
        "parcela": f"R$ {parcela:,.2f}",
        "total_juros": f"R$ {juros_total:,.2f}",
        "total_pago": f"R$ {total_geral:,.2f}",
        "meses": meses
    }
})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8000, debug=True)
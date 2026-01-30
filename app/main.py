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
    
    entrada_usuario = float(requests.args.get('entrada', 0))
    taxa_usuario = float(request.args.get('juros', 1.5)) / 100

    url = f"{BASE_URL}/{marca_id}/modelos/{modelo_id}/ano/{ano_id}"
    dados_fipe = request.get(url).json()

    valor_str = dados_fipe.get('Valor', '0').replace('R$ ', '').replace('.', '').replace('.', '')
    valor_total = float(valor_str)

    if entrada_usuario >= valor_total:
        return jsonify({"erro": "A entrada não pode ser mairo que o valor do carro!"})
    
    valor_financiado = valor_total - entrada_usuario
    meses = 48
    parcela = valor_financiado * (taxa_usuario * (1 + taxa_usuario)**meses) / ((1 + taxa_usuario)**meses - 1)

    return jsonify({
        "carro": f"{dados_fipe['Marca']} {dados_fipe['Modelo']}",
        "ano": dados_fipe['AnoModelo'],
        "preco_tabela": dados_fipe['Valor'],
        "simulacao_48x": {
            "parcela": f"R$ {parcela:,.2f}",
            "total_final": f"R$ {(parcela * meses) + entrada_usuario:,.2f}"
        }
    })

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8000, debug=True)
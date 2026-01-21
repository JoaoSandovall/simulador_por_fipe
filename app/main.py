import requests
from flask import Flask, jsonify, request

app = Flask(__name__)

FIPE_API_URL = "https://parallelum.com.br/fipe/api/v1/carros/marcas"

@app.route('/')
def index():
    return "Servidor funcionando"

@app.route('/buscar_marcas')
def buscar_marcas():
    response = requests.get(FIPE_API_URL)
    return jsonify(response.json())

@app.route('/simular')
def simular():
    valor_veiculo = float(request.args.get('valor', 0))
    entrada = float(request.args.get('entrada', 0))
    n_parcelas = float(request.args.get("parcels", 48))
    taxa = 0.018

    if valor_veiculo <= entrada:
        return jsonify({"erro": "A entrada deve ser menor que o valor do veículo."})
    
    valor_financiado = valor_veiculo - entrada

    parcela = valor_financiado * (taxa * (1 + taxa)**n_parcelas) / ((1 + taxa)**n_parcelas - 1)

    return jsonify({
        "valor_do_carro": valor_veiculo,
        "valor_financiado": valor_financiado,
        "valor_da_parcela": round(parcela, 2),
        "total_pago_no_final": round(parcela * n_parcelas, 2),
        "juros_pagos": round((parcela * n_parcelas) - valor_financiado, 2)
    })

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8000, debug=True)
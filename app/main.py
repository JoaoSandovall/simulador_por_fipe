from flask import Flask, jsonify, request
import os 

app = Flask(__name__)

@app.route('/')
def home():
    return "Servidor funcionando"

@app.route('/simular')
def simular():
    valor_carro = float(request.args.get('valor', 50000))
    entrada = float(request.args.get('entrada', 10000))
    taxa = 0.015
    meses = 48

    valor_financiado = valor_carro - entrada
    parcela = valor_financiado * (taxa * (1 + taxa)**meses) / ((1 + taxa)**meses - 1)

    return jsonify({
        "valor_carro": valor_carro,
        "parcela_mensal": round(parcela, 2),
        "total_financiado": round(parcela * meses, 2)
    })

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8000, debug=True)
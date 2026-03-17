<h1 align="center">🚗 Simulador de Financiamento FIPE</h1>

<p align="center">
  Aplicação <strong>Full Stack</strong> para consulta em tempo real da Tabela FIPE e simulação de financiamento automotivo.
</p>

---

### 🛠️ Especificações Técnicas

<table>
  <tr>
    <td align="center"><strong>Back-End</strong></td>
    <td>
      <img src="https://skillicons.dev/icons?i=py,flask,gunicorn" alt="Back-End" />
    </td>
  </tr>
  <tr>
    <td align="center"><strong>Front-End</strong></td>
    <td>
      <img src="https://skillicons.dev/icons?i=html,css,js,tailwind" alt="Front-End" />
    </td>
  </tr>
  <tr>
    <td align="center"><strong>Infra & Dev</strong></td>
    <td>
      <img src="https://skillicons.dev/icons?i=docker,vercel" alt="DevOps" />
    </td>
  </tr>
</table>

* **API de Dados:** Integração com a REST API Parallelum (v1) para dados da Tabela FIPE.
* **Cálculos:** Implementação da **Tabela Price** para parcelamento com juros compostos.

---

### 📦 Estrutura de Arquivos

* `app/main.py`: Endpoints da API, integração FIPE e motor de cálculo financeiro.
* `app/templates/index.html`: Estrutura da UI com componentes Tom-Select.
* `app/static/js/script.js`: Cliente assíncrono para consumo dos endpoints internos.
* `Dockerfile` & `docker-compose.yml`: Definições de infraestrutura como código (IaC).
* `requirements.txt`: Dependências do ecossistema Python (Flask, Requests, Gunicorn).
* `vercel.json`: Manifesto de deploy para Serverless Functions.

---

### ⚙️ Instalação e Execução

#### 🐳 Ambiente Docker

# Build e execução do container na porta 8000
docker-compose up --build

# Instalação de dependências
pip install -r requirements.txt

# Execução via Python
python app/main.py

<table>
<tr>
<td align="center"><strong>Ambiente</strong></td>
<td>Variáveis de ambiente configuradas via <code>.env</code> (ignorado no versionamento).</td>
</tr>
<tr>
<td align="center"><strong>Produção</strong></td>
<td>Modo <code>debug</code> desativado no Flask e binding via Gunicorn na porta <code>0.0.0.0:8000</code>.</td>
</tr>
<tr>
<td align="center"><strong>Tratamento</strong></td>
<td>Sanitização de strings monetárias e proteção contra divisão por zero em cálculos de juros.</td>
</tr>
</table>

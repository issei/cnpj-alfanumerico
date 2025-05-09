# 📘 Documentação Técnica – Validador de CNPJ Alfanumérico

## 📂 Estrutura do Projeto

```
/
├── cnpj.js            → Classe com regras de validação, formatação e cálculo de DV do CNPJ alfanumérico
├── cnpj.test.js       → Testes unitários com Jest
├── index.js           → Script Node.js para testes em linha de comando (sem interface)
└── index.html         → Página HTML com input, máscara automática e validação ao blur
```

---

## 🧠 Objetivo

Este projeto permite:

* Validar CNPJs alfanuméricos (ex: `A1B2C3D4E5F668`)
* Aplicar máscara automática enquanto o usuário digita (`XX.XXX.XXX/XXXX-XX`)
* Calcular os dígitos verificadores (DV) de um CNPJ base (12 caracteres)
* Integrar facilmente em aplicações web ou Node.js

---

## 📌 Formato Aceito

* O CNPJ alfanumérico possui:

  * **12 caracteres alfanuméricos** (letras maiúsculas de A-Z e dígitos de 0-9)
  * **2 dígitos verificadores (DV)** calculados por módulo 11
  * Total: **14 caracteres válidos**

* Máscara visual: `XX.XXX.XXX/XXXX-XX` (também aceita entrada sem máscara)

---

## 📦 Arquivos e Funcionalidades

### ✅ `cnpj.js` — Lógica principal de validação

Classe `CNPJ` exportada como módulo ES6. Contém os seguintes métodos públicos:

#### `CNPJ.isValid(cnpj: string): boolean`

Verifica se um CNPJ completo (com ou sem máscara) é válido.

#### `CNPJ.calculaDV(baseCNPJ: string): string`

Retorna os dois dígitos verificadores (DV) de uma base válida com 12 caracteres alfanuméricos. Lança erro para entradas inválidas.

#### `CNPJ.removeMascaraCNPJ(cnpj: string): string`

Remove os caracteres `.`, `/` e `-`, retornando a string limpa para validação.

---

### 🧪 `cnpj.test.js` — Testes unitários com Jest

Arquivo que cobre 100% das funcionalidades da classe `CNPJ`:

* Casos válidos com diferentes combinações alfanuméricas
* Casos inválidos (DV errado, tamanho incorreto, letras minúsculas, símbolos)
* Entradas com e sem máscara
* Testes diretos do cálculo de DV
* Verificações de lançamento de erro em inputs malformados

Para rodar:

```bash
npm install jest --save-dev
npm test
```

---

### 💻 `index.html` — Interface Web com Máscara Dinâmica

Campo de input que:

* Aplica **máscara automaticamente enquanto o usuário digita**
* Valida o CNPJ ao sair do campo (`blur`)
* Mostra feedback visual:

  * Borda verde e mensagem ✅ se válido
  * Borda vermelha e mensagem ❌ se inválido

Uso da classe via `import CNPJ from './cnpj.js'` com `<script type="module">`.

> ⚠️ Necessário rodar em servidor local (ex: `npx serve`), pois ES Modules não funcionam em `file://`.

---

### 🧪 `index.js` — Validador em linha de comando (Node.js)

Permite testar a lógica sem interface gráfica:

* Valida uma lista de CNPJs (válidos e inválidos)
* Calcula DVs para bases de 12 caracteres
* Remove máscara de CNPJs formatados

Uso:

```bash
node index.js
```

Saída esperada:

```
🔍 VALIDAÇÃO DE CNPJs:
12ABC34501DE35 → ✅ Válido
12ABC34501DE00 → ❌ Inválido
...

🧮 CÁLCULO DO DV:
12ABC34501DE → DV: 35 → CNPJ completo: 12ABC34501DE35
...

🧼 REMOÇÃO DE MÁSCARA:
12.ABC.345/01DE-35 → 12ABC34501DE35
...
```

---

## 🛡️ Regras de Validação Implementadas

* Tamanho final: 14 caracteres
* Apenas letras maiúsculas (A–Z) e dígitos (0–9)
* Remoção de máscara antes da validação
* Rejeição de CNPJs compostos só de zeros
* Verificação de DV conforme módulo 11 com pesos `[6,5,4,3,2,9,8,7,6,5,4,3,2]`

---

## ⚙️ Tecnologias Utilizadas

* JavaScript ES6+
* Jest para testes automatizados
* HTML5 nativo
* CSS inline simples para validação visual

---

## ✅ Como Executar

### Ambiente Web

1. Rode um servidor local na pasta:

```bash
npx serve
```

2. Acesse `http://localhost:3000` ou URL fornecida

### Ambiente Node.js

1. Execute:

```bash
node index.js
```

2. (Opcional) Execute os testes:

```bash
npm test
```

---

## 📈 Possíveis Extensões Futuras

* Adicionar suporte a CPF, IE, outros documentos com DV
* Permitir letras minúsculas como válidas (convertendo)
* Adicionar tooltip de erro em campos HTML
* Integração com frameworks como React/Vue


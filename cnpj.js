class CNPJ {
  // Constantes estáticas para configuração e regex
  static tamanhoCNPJSemDV = 12;
  static regexCNPJSemDV = /^([A-Z\d]){12}$/;
  static regexCNPJ = /^([A-Z\d]){12}\d{2}$/;
  static regexMascara = /[.\-\/]/g;
  static regexCaracteresNaoPermitidos = /[^A-Z\d.\-\/]/i;
  static valorBase = '0'.charCodeAt(0);
  static pesosDV = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  static cnpjZerado = '00000000000000';

  /**
   * Verifica se um CNPJ (alfanumérico) completo é válido.
   * @param {string} cnpj - CNPJ de 14 caracteres (com ou sem máscara).
   * @returns {boolean} True se válido, False se inválido.
   */
  static isValid(cnpj) {
    if (cnpj == null) {
      // null ou undefined não são válidos
      return false;
    }
    // Converte para string e remove espaços ao redor
    const entrada = String(cnpj).trim().toUpperCase();
    // Verifica se há caracteres inválidos
    if (this.regexCaracteresNaoPermitidos.test(entrada)) {
      return false;
    }
    // Remove pontuação de máscara (se houver) 
    const cnpjSemMascara = this.removeMascaraCNPJ(entrada);
    // Validação básica de formato e valor contra casos inválidos
    if (!this.regexCNPJ.test(cnpjSemMascara) || cnpjSemMascara === this.cnpjZerado) {
      return false;
    }
    // Se formato válido, separa base e DV
    const base = cnpjSemMascara.slice(0, this.tamanhoCNPJSemDV);
    const dvInformado = cnpjSemMascara.slice(this.tamanhoCNPJSemDV);
    // Calcula DV a partir da base e compara
    const dvCalculado = this.calculaDV(base);
    return dvInformado === dvCalculado;
  }

  /**
   * Calcula os dígitos verificadores (DV) para um CNPJ base (12 caracteres).
   * @param {string} cnpj - 12 caracteres alfanuméricos do CNPJ (com ou sem máscara).
   * @returns {string} Dois dígitos verificadores calculados.
   * @throws {Error} Se a entrada não for 12 caracteres válidos para cálculo do DV.
   */
  static calculaDV(cnpj) {
    if (cnpj == null) {
      throw new Error("Não é possível calcular o DV: CNPJ ausente ou inválido");
    }
    const entrada = String(cnpj).trim().toUpperCase();
    if (this.regexCaracteresNaoPermitidos.test(entrada)) {
      throw new Error("Não é possível calcular o DV: contém caracteres inválidos");
    }
    const cnpjSemMascara = this.removeMascaraCNPJ(entrada);
    // Verifica se são exatamente 12 caracteres válidos (base do CNPJ)
    if (!this.regexCNPJSemDV.test(cnpjSemMascara) ||
        cnpjSemMascara === this.cnpjZerado.slice(0, this.tamanhoCNPJSemDV)) {
      throw new Error("Não é possível calcular o DV pois o CNPJ fornecido é inválido");
    }
    // Usa o método interno para calcular DV assumindo entrada válida
    return this.calculaDVBase(cnpjSemMascara);
  }

  /**
   * Remove caracteres de máscara (pontos, barras, traços) de um CNPJ.
   * @param {string} cnpj - CNPJ possivelmente formatado.
   * @returns {string} CNPJ contendo apenas caracteres alfanuméricos.
   */
  static removeMascaraCNPJ(cnpj) {
    return String(cnpj).replace(this.regexMascara, '');
  }

  /**
   * (Privado) Calcula os DVs para uma base de CNPJ de 12 caracteres assumidamente válida.
   * @param {string} baseCNPJ - 12 caracteres (já sem máscara e válidos).
   * @returns {string} Dois dígitos verificadores correspondentes.
   */
  static calculaDVBase(baseCNPJ) {
    // Calcula primeiro e segundo DV usando os pesos predefinidos
    let somaDV1 = 0;
    let somaDV2 = 0;
    for (let i = 0; i < this.tamanhoCNPJSemDV; i++) {
      const valor = baseCNPJ.charCodeAt(i) - this.valorBase;
      somaDV1 += valor * this.pesosDV[i + 1];
      somaDV2 += valor * this.pesosDV[i];
    }
    const dv1 = (somaDV1 % 11 < 2) ? 0 : 11 - (somaDV1 % 11);
    somaDV2 += dv1 * this.pesosDV[this.tamanhoCNPJSemDV];
    const dv2 = (somaDV2 % 11 < 2) ? 0 : 11 - (somaDV2 % 11);
    return `${dv1}${dv2}`;
  }
}

export default CNPJ;
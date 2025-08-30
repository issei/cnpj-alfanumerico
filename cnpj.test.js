// Importa as funções globais de teste do Jest e a classe CNPJ a ser testada
import { describe, test, expect } from '@jest/globals';
import CNPJ from './cnpj.js';

/**
 * 1. Casos Válidos de CNPJ Alfanumérico
 *    - Usa exemplos de CNPJs válidos (12 caracteres alfanuméricos + 2 dígitos verificadores corretos).
 *    - Verifica que a função isValid retorna true para cada um.
 */
describe('CNPJs Válidos (alfanuméricos)', () => {
  // Lista de CNPJs completos (base de 12 caracteres + DV de 2 dígitos) sabidamente válidos
  const cnpjsValidos = [
    '12ABC34501DE35',  // Exemplo com letras e números (DV calculado corretamente como "35")
    'A1B2C3D4E5F668',  // Exemplo com letras maiúsculas e dígitos (DV = "89")
    '0001A1B2C3D480',  // Exemplo iniciando com zeros e letras (DV = "13")
    'Z9Y8X7W6V5U429',  // Exemplo contendo letras no final da base (DV = "07")
    '1A2B3C4D5E6F34',  // Exemplo alfanumérico alternado (DV = "16")
  ];

  test.each(cnpjsValidos)('CNPJ válido deve retornar true: %s', (cnpj) => {
    expect(CNPJ.isValid(cnpj)).toBe(true);
  });

  test('CNPJ válido (alfanumérico) específico deve retornar true', () => {
    const cnpjValido = '12ABC34501DE35';  // Exemplo do PDF/documentação
    expect(CNPJ.isValid(cnpjValido)).toBe(true);
  });

  test('CNPJ válido com letras minúsculas deve retornar true', () => {
    const cnpjMinusculas = 'a1b2c3d4e5f668'; // Versão em minúsculas de um CNPJ válido
    expect(CNPJ.isValid(cnpjMinusculas)).toBe(true);
  });

  test('CNPJ válido com letras misturadas (maiúsculas/minúsculas) deve retornar true', () => {
    const cnpjMisto = '12.AbC.345/01dE-35'; // Versão com máscara e letras misturadas
    expect(CNPJ.isValid(cnpjMisto)).toBe(true);
  });
});

/**
 * 2. Casos Inválidos de CNPJ
 *    Verifica diferentes cenários de entradas inválidas para garantir que isValid retorne false:
 *    - Dígitos verificadores incorretos
 *    - Comprimento incorreto (menor ou maior que 14 caracteres alfanuméricos)
 *    - Caracteres especiais não permitidos
 *    - CNPJ composto somente por zeros
 *    - Letras minúsculas (fora do padrão esperado de letras maiúsculas)
 */
describe('CNPJs Inválidos', () => {
  // Exemplos de CNPJs inválidos cobrindo vários cenários
  const cnpjsInvalidos = [
    '12ABC34501DE00',    // DV incorreto (deveria ser "35")
    'A1B2C3D4E5F678',    // DV incorreto (deveria ser "89")
    '1234567890123',     // Apenas 13 caracteres (falta um dígito para 14)
    '00000000000000',    // CNPJ composto somente de zeros (inválido por regra)
    '12ABC34501DE',      // Apenas base de 12 caracteres sem DV
    '12ABC!4501DE35',    // Contém caracter especial não permitido '!'
    'A1B2C3D4E5F6G7',    // 15 caracteres (mais de 14 permitidos)
  ];

  test.each(cnpjsInvalidos)('CNPJ inválido deve retornar false: %s', (cnpj) => {
    expect(CNPJ.isValid(cnpj)).toBe(false);
  });

  test('CNPJ com dígitos verificadores incorretos deve retornar false', () => {
    const cnpjDVErrado = '12ABC34501DE00';  // DV "00" está incorreto para a base "12ABC34501DE"
    expect(CNPJ.isValid(cnpjDVErrado)).toBe(false);
  });

  test('CNPJ com tamanho menor que o esperado deve retornar false', () => {
    const cnpjCurto = '12ABC34501D';  // Apenas 11 caracteres (falta parte da base e DV)
    expect(CNPJ.isValid(cnpjCurto)).toBe(false);
  });

  test('CNPJ com tamanho maior que o esperado deve retornar false', () => {
    const cnpjLongo = 'A1B2C3D4E5F6G7';  // 15 caracteres alfanuméricos (1 a mais que o permitido)
    expect(CNPJ.isValid(cnpjLongo)).toBe(false);
  });

  test('CNPJ contendo caracteres especiais deve retornar false', () => {
    const cnpjComCaracterInvalido = '12AB#C34501DE35';  // Contém '#' que não é permitido
    expect(CNPJ.isValid(cnpjComCaracterInvalido)).toBe(false);
  });

  test('CNPJ composto somente de zeros deve retornar false', () => {
    const cnpjZerado = '00000000000000';  // 14 zeros
    expect(CNPJ.isValid(cnpjZerado)).toBe(false);
  });
});

/**
 * 3. Comportamento da função isValid com e sem máscara
 *    - Garante que a validação funcione corretamente tanto para entradas com máscara de formatação quanto sem.
 *    - Testa um CNPJ válido com máscara e o mesmo sem máscara (deve retornar true em ambos os casos).
 *    - Testa um CNPJ inválido com máscara (deve retornar false).
 */
describe('Funcionalidade isValid - CNPJs com e sem máscara', () => {
  test('CNPJ válido com máscara deve ser tratado corretamente (retorna true)', () => {
    const cnpjMascaradoValido = '12.ABC.345/01DE-35';
    const cnpjSemMascara = '12ABC34501DE35';  // Equivalente sem máscara
    // Verifica que isValid reconhece o CNPJ mascarado como válido assim como o não mascarado
    expect(CNPJ.isValid(cnpjMascaradoValido)).toBe(true);
    expect(CNPJ.isValid(cnpjSemMascara)).toBe(true);
  });

  test('CNPJ inválido com máscara deve retornar false', () => {
    const cnpjMascaradoInvalido = '12.ABC.345/01DE-00';  // Máscara aplicada, porém DV "00" incorreto
    expect(CNPJ.isValid(cnpjMascaradoInvalido)).toBe(false);
  });
});

/**
 * 4. Testes diretos da função calculaDV
 *    - Fornece bases de 12 caracteres (alfanuméricos) e verifica se calculaDV retorna os dois dígitos verificadores corretos.
 *    - Inclui casos de base puramente numérica e bases mistas com letras, cobrindo diferentes valores.
 */
describe('Função CNPJ.calculaDV (cálculo dos dígitos verificadores)', () => {
  // Casos de teste com base de 12 caracteres e seus DVs esperados
  const casosDV = [
    { base: '12ABC34501DE', dvEsperado: '35' },   // Base alfanumérica (exemplo do PDF, DV conhecido = "35")
    { base: 'A1B2C3D4E5F6', dvEsperado: '68' },   // Base alfanumérica com letras e números, DV = "68"
    { base: '0001A1B2C3D4', dvEsperado: '80' },   // Base começando com "0001" e letras, DV = "80"
    { base: 'Z9Y8X7W6V5U4', dvEsperado: '29' },   // Base com letras decrescentes, DV = "29"
    { base: '1A2B3C4D5E6F', dvEsperado: '34' },   // Base alfanumérica alternada, DV = "34"
    { base: '123456789012', dvEsperado: '30' },   // Base puramente numérica, DV = "30" (exemplo de CNPJ numérico válido)
  ];

  test.each(casosDV)('calculaDV("%s") deve retornar "%s"', ({ base, dvEsperado }) => {
    expect(CNPJ.calculaDV(base)).toBe(dvEsperado);
  });

  test('calculaDV retorna corretamente os DVs esperados para uma base alfanumérica', () => {
    const baseAlfa = '12ABC34501DE';
    const dvCalculado = CNPJ.calculaDV(baseAlfa);
    const dvEsperado = '35';  // DV esperado conforme cálculo conhecido
    expect(dvCalculado).toBe(dvEsperado);
  });

  test('calculaDV retorna corretamente os DVs esperados para uma base numérica', () => {
    const baseNumerica = '123456789012';
    const dvCalculado = CNPJ.calculaDV(baseNumerica);
    const dvEsperado = '30';  // DV esperado para a base numérica acima
    expect(dvCalculado).toBe(dvEsperado);
  });

  test('calculaDV deve ser case-insensitive e calcular DV para base com letras minúsculas', () => {
    const baseMinusculas = 'a1b2c3d4e5f6'; // Base em minúsculas
    const dvEsperado = '68'; // Mesmo DV da base em maiúsculas
    expect(CNPJ.calculaDV(baseMinusculas)).toBe(dvEsperado);
  });
});

/**
 * 5. Testes da função removeMascaraCNPJ
 *    - Garante que todos os caracteres de pontuação da máscara (ponto, barra, hífen) sejam removidos corretamente.
 *    - Verifica também que caracteres alfanuméricos permanecem inalterados e que entradas sem máscara retornam o mesmo valor.
 */
describe('Função CNPJ.removeMascaraCNPJ (remoção de máscara de formatação)', () => {
  test('Deve remover todos os caracteres de pontuação de um CNPJ com máscara alfanumérica', () => {
    const entradaMascarada = '12.ABC.345/01DE-35';
    const esperadoSemMascara = '12ABC34501DE35';
    expect(CNPJ.removeMascaraCNPJ(entradaMascarada)).toBe(esperadoSemMascara);
  });

  test('Deve remover todos os caracteres de pontuação de um CNPJ com máscara numérica', () => {
    const entradaMascaradaNumerica = '11.444.777/0001-61';
    const esperadoSemMascara = '11444777000161';
    expect(CNPJ.removeMascaraCNPJ(entradaMascaradaNumerica)).toBe(esperadoSemMascara);
  });

  test('Entrada sem caracteres de máscara deve permanecer inalterada', () => {
    const entradaSemMascara = 'ABC123456789';
    expect(CNPJ.removeMascaraCNPJ(entradaSemMascara)).toBe('ABC123456789');
  });
});

/**
 * 6. Entradas malformadas para calculaDV (erros esperados)
 *    - Testa chamadas à função calculaDV com entradas inválidas que devem lançar exceções.
 *    - Inclui: base com caracteres não permitidos, base com comprimento incorreto (menor ou maior que 12), e base composta só de zeros.
 *    - Verifica que em todos os casos um Error é lançado com a mensagem apropriada.
 */
describe('Tratamento de entradas malformadas em CNPJ.calculaDV (lançamento de erros)', () => {
    test('Deve lançar erro ao calcular DV de uma string contendo caracteres inválidos', () => {
        const baseInvalida = '12ABC34501D?';  // Contém '?' não permitido
        expect(() => CNPJ.calculaDV(baseInvalida)).toThrow("Não é possível calcular o DV: contém caracteres inválidos");
      });

      
  test('Deve lançar erro ao calcular DV de uma base com menos de 12 caracteres', () => {
    const baseCurta = '12345678901';  // 11 caracteres apenas
    expect(() => CNPJ.calculaDV(baseCurta)).toThrow("Não é possível calcular o DV pois o CNPJ fornecido é inválido");
  });

  test('Deve lançar erro ao calcular DV de uma base com mais de 12 caracteres', () => {
    const baseLonga = 'A1B2C3D4E5F6G7';  // 13 caracteres (excede o tamanho da base sem DV)
    expect(() => CNPJ.calculaDV(baseLonga)).toThrow("Não é possível calcular o DV pois o CNPJ fornecido é inválido");
  });

  test('Deve lançar erro ao calcular DV de um CNPJ completo (14 caracteres incluindo DV)', () => {
    const cnpjCompleto = '12345678901230';  // 14 dígitos (base de 12 + DV "30")
    expect(() => CNPJ.calculaDV(cnpjCompleto)).toThrow("Não é possível calcular o DV pois o CNPJ fornecido é inválido");
  });

  test('Deve lançar erro ao calcular DV de uma base composta somente por zeros', () => {
    const baseZeros = '000000000000';  // 12 zeros
    expect(() => CNPJ.calculaDV(baseZeros)).toThrow("Não é possível calcular o DV pois o CNPJ fornecido é inválido");
  });
});

import CNPJ from './cnpj.js';

// Lista de CNPJs para teste
const cnpjs = [
  '12ABC34501DE35',    // Válido (exemplo oficial)
  'A1B2C3D4E5F689',    // Válido
  '12.ABC.345/01DE-35',// Válido com máscara
  '12ABC34501DE00',    // Inválido - DV incorreto
  '1234567890123',     // Inválido - DV incorreto
  '12ABC!4501DE35',    // Inválido - caractere especial
  '00000000000000',    // Inválido - CNPJ zerado
  'A1B2C3D4E5F6G7',    // Inválido - maior que 14
];

// Testa a validação de CNPJs
console.log('\n🔍 VALIDAÇÃO DE CNPJs:\n');

cnpjs.forEach(cnpj => {
  try {
    const isValido = CNPJ.isValid(cnpj);
    console.log(`${cnpj} → ${isValido ? '✅ Válido' : '❌ Inválido'}`);
  } catch (error) {
    console.log(`${cnpj} → ⚠️ Erro: ${error.message}`);
  }
});

// Testa o cálculo de DV
console.log('\n🧮 CÁLCULO DO DV:\n');

const basesValidas = [
  '12ABC34501DE',
  'A1B2C3D4E5F6',
  'Z9Y8X7W6V5U4',
  '0001A1B2C3D4'
];

basesValidas.forEach(base => {
  try {
    const dv = CNPJ.calculaDV(base);
    console.log(`${base} → DV: ${dv} → CNPJ completo: ${base}${dv}`);
  } catch (error) {
    console.log(`${base} → ⚠️ Erro: ${error.message}`);
  }
});

// Testa a remoção de máscara
console.log('\n🧼 REMOÇÃO DE MÁSCARA:\n');

const mascarados = [
  '12.ABC.345/01DE-35',
  'A1.B2.C3/D4E5-F689',
  '00.01.A1.B2C3D4/13'
];

mascarados.forEach(masc => {
  const limpo = CNPJ.removeMascaraCNPJ(masc);
  console.log(`${masc} → ${limpo}`);
});

/** Frases motivacionais de treino — uma por dia, rotacionadas pelo dia do ano. */
export const QUOTES: string[] = [
  'Disciplina é fazer o treino mesmo quando a motivação não aparece.',
  'Cada série conta. Cada repetição constrói quem você está se tornando.',
  'O corpo alcança o que a mente acredita.',
  'Não é sobre ser o melhor. É sobre ser melhor do que ontem.',
  'Consistência vence intensidade quando a intensidade não é consistente.',
  'Treino pago, dia ganho.',
  'A dor de hoje é a força de amanhã.',
  'Pequenos progressos ainda são progressos.',
  'Você nunca se arrepende de um treino feito.',
  'Suor é só gordura chorando. Bora!',
  'Quem treina no frio, luta no quente.',
  'O round mais difícil é o que você decide não desistir.',
  'Força não vem do que você consegue fazer, vem de superar o que achava que não conseguia.',
  'Seu único limite é aquele que você aceita.',
  'Foco na técnica, a carga vem depois.',
  'Hoje é um ótimo dia para bater um recorde pessoal.',
  'Respira, trava o core e confia no processo.',
  'Descanso também é treino — mas hoje é dia de trabalhar.',
  'A barra não fica mais leve; você fica mais forte.',
  'Mantenha a guarda alta e o objetivo mais alto ainda.',
  'Excelência é um hábito, não um ato.',
  'Uma hora por dia. Vinte e três para colher os resultados.',
  'O que te desafia é o que te transforma.',
  'Comece onde você está. Use o que você tem. Faça o que você pode.',
  'Isometria ensina paciência: segure mais um segundo.',
  'Campeões são feitos nos dias em que ninguém está olhando.',
  'Progresso lento ainda é mais rápido que desistir.',
  'O suor de hoje é o sorriso de amanhã.',
  'Não conte os dias. Faça os dias contarem.',
  'Movimento bem feito vale mais que movimento pesado.',
  'Você é mais forte do que pensa e mais capaz do que imagina.',
  'Treine como se o próximo round fosse o da final.',
  'Constância transforma o difícil em rotina.',
  'Termine o que começou. A última série é a que muda o jogo.',
  'Cuide do corpo: é o único lugar em que você vai viver.',
  'Sem atalhos. Só trabalho bem feito.',
  'Hoje: aparecer, executar, evoluir.',
  'A vontade de vencer não vale nada sem a vontade de se preparar.',
  'Mente calma, golpe preciso.',
  'Seu futuro eu agradece pelo treino de hoje.',
];

export function dayOfYear(t = Date.now()) {
  const d = new Date(t);
  const start = new Date(d.getFullYear(), 0, 0);
  return Math.floor((d.getTime() - start.getTime() - (d.getTimezoneOffset() - start.getTimezoneOffset()) * 60_000) / 86_400_000);
}

export const quoteOfDay = (t = Date.now()) => QUOTES[(dayOfYear(t) + new Date(t).getFullYear()) % QUOTES.length];

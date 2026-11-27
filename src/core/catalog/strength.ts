/**
 * Catálogo de Musculação — 150 exercícios (149 cadastros: o nº 139 "Supino fechado no Smith"
 * é o mesmo exercício do nº 9 e aparece nos grupos Peitoral e Tríceps).
 * Máquinas articuladas, Smith (barra guiada), cabos/polias e máquinas de academia.
 */
import { Exercise, ExerciseMuscle, Goal, Level, StrengthGroup } from '../domain/types';
import { p, s, st } from './helpers';

const B: Level = 'beginner';
const I: Level = 'intermediate';
const A: Level = 'advanced';

// Vocabulário de equipamentos
const ART = 'Máquina articulada';
const SMITH = 'Smith';
const POLIA = 'Polia';
const CROSS = 'Crossover';
const MAQ = 'Máquina';
const BANCO = 'Banco';
const CORDA = 'Corda';
const BARRA = 'Barra reta';
const BARRA_W = 'Barra W';
const TRI = 'Triângulo';
const PEG = 'Pegador';
const TORN = 'Tornozeleira';
const LEG = 'Leg Press';
const HACK = 'Hack';
const GRAV = 'Graviton';
const STEP = 'Step';

function x(
  catalogNo: number,
  id: string,
  name: string,
  groups: StrengthGroup[],
  level: Level,
  equipment: string[],
  muscles: ExerciseMuscle[],
  restS: number,
  tip: string,
  goals: Goal[] = ['hypertrophy'],
): Exercise {
  return { id, name, modality: 'strength', tracking: 'reps', level, goals, equipment, muscles, tip, groups, catalogNo, attributes: { defaultRestS: restS } };
}

export const STRENGTH: Exercise[] = [
  // ============================================================ 1. Peitoral (20)
  x(1, 'supino_reto_articulado', 'Supino reto na máquina articulada', ['chest'], B, [ART], [p('chest'), s('triceps', 0.6), s('front_delts', 0.5)], 90, 'Ajuste o banco para as pegadas ficarem na linha do meio do peito; escápulas encaixadas no encosto.', ['hypertrophy', 'strength']),
  x(2, 'supino_inclinado_articulado', 'Supino inclinado na máquina articulada', ['chest'], B, [ART], [p('chest'), s('front_delts', 0.7), s('triceps', 0.5)], 90, 'Empurre na direção do rosto sem tirar as costas do encosto; foque na porção clavicular.'),
  x(3, 'supino_declinado_articulado', 'Supino declinado na máquina articulada', ['chest'], B, [ART], [p('chest'), s('triceps', 0.6), s('front_delts', 0.3)], 90, 'Trajetória para baixo e à frente; não deixe os ombros subirem no final do movimento.'),
  x(4, 'supino_reto_smith', 'Supino reto no Smith (barra guiada)', ['chest'], I, [SMITH, BANCO], [p('chest'), s('triceps', 0.7), s('front_delts', 0.6), st('forearms', 0.3)], 120, 'Posicione o banco para a barra descer na linha dos mamilos; pés firmes e retração escapular.', ['hypertrophy', 'strength']),
  x(5, 'supino_inclinado_smith', 'Supino inclinado no Smith', ['chest'], I, [SMITH, BANCO], [p('chest'), s('front_delts', 0.7), s('triceps', 0.6)], 120, 'Banco a 30°: a barra toca a parte alta do peito; cotovelos a ~60° do tronco.', ['hypertrophy', 'strength']),
  x(6, 'supino_declinado_smith', 'Supino declinado no Smith', ['chest'], I, [SMITH, BANCO], [p('chest'), s('triceps', 0.7), s('front_delts', 0.3)], 120, 'Prenda bem as pernas no apoio; desça a barra até a parte baixa do peito com controle.'),
  x(7, 'supino_reto_unilateral_articulado', 'Supino reto unilateral na máquina articulada', ['chest'], I, [ART], [p('chest'), s('triceps', 0.6), s('front_delts', 0.5), st('obliques', 0.3)], 75, 'Mantenha o tronco parado — não gire o quadril para compensar o lado que empurra.'),
  x(8, 'supino_inclinado_unilateral_articulado', 'Supino inclinado unilateral na máquina articulada', ['chest'], I, [ART], [p('chest'), s('front_delts', 0.7), s('triceps', 0.5), st('obliques', 0.3)], 75, 'Execute o lado mais fraco primeiro e repita o mesmo número de reps no outro.'),
  x(9, 'supino_fechado_smith', 'Supino fechado no Smith', ['chest', 'triceps'], I, [SMITH, BANCO], [p('triceps'), p('chest', 0.8), s('front_delts', 0.5)], 120, 'Pegada na largura dos ombros e cotovelos junto ao tronco; a barra desce no esterno.', ['hypertrophy', 'strength']),
  x(10, 'chest_press_sentado', 'Supino vertical sentado na máquina (Chest Press)', ['chest'], B, [MAQ], [p('chest'), s('triceps', 0.6), s('front_delts', 0.5)], 75, 'Pegadas na altura do meio do peito; estenda sem travar os cotovelos e volte devagar.'),
  x(11, 'supino_convergente', 'Supino convergente na máquina', ['chest'], B, [ART], [p('chest'), s('triceps', 0.5), s('front_delts', 0.5)], 75, 'Aproveite a convergência: aperte o peitoral no final, aproximando as mãos.'),
  x(12, 'peck_deck', 'Crucifixo na máquina (Peck Deck / Voador)', ['chest'], B, [MAQ], [p('chest'), s('front_delts', 0.4)], 60, 'Cotovelos levemente flexionados e fixos; abra até sentir o alongamento sem forçar o ombro.'),
  x(13, 'peck_deck_unilateral', 'Crucifixo unilateral no Peck Deck', ['chest'], I, [MAQ], [p('chest'), s('front_delts', 0.4), st('obliques', 0.3)], 60, 'Segure o outro braço da máquina parado para estabilizar; leve a mão até a linha média.'),
  x(14, 'crossover_polia_alta', 'Crossover na polia alta (em pé)', ['chest'], I, [CROSS, PEG], [p('chest'), s('front_delts', 0.4), st('abs', 0.3)], 60, 'Tronco levemente inclinado à frente; traga as mãos para baixo e cruze à frente do quadril.'),
  x(15, 'crossover_polia_media', 'Crossover na polia média', ['chest'], I, [CROSS, PEG], [p('chest'), s('front_delts', 0.4)], 60, 'Polias na altura dos ombros; feche os braços na horizontal como num abraço.'),
  x(16, 'crossover_polia_baixa', 'Crossover na polia baixa (foco clavicular)', ['chest'], I, [CROSS, PEG], [p('chest'), s('front_delts', 0.6)], 60, 'Puxe de baixo para cima até a altura do queixo; palmas voltadas para cima.'),
  x(17, 'crucifixo_reto_polia', 'Crucifixo reto na polia (banco horizontal)', ['chest'], I, [CROSS, BANCO, PEG], [p('chest'), s('front_delts', 0.4)], 60, 'Com o banco entre as polias, a tensão continua mesmo com os braços fechados no topo.'),
  x(18, 'crucifixo_inclinado_polia', 'Crucifixo inclinado na polia (banco a 30°/45°)', ['chest'], I, [CROSS, BANCO, PEG], [p('chest'), s('front_delts', 0.6)], 60, 'Banco a 30–45°; desça em arco amplo e suba fechando sobre a parte alta do peito.'),
  x(19, 'crucifixo_declinado_polia', 'Crucifixo declinado na polia', ['chest'], I, [CROSS, BANCO, PEG], [p('chest'), s('front_delts', 0.3)], 60, 'Mantenha o quadril acima do peito e feche os braços na direção da barriga.'),
  x(20, 'cable_chest_press', 'Pressão de peito na polia (Cable Chest Press em pé)', ['chest'], I, [CROSS, PEG], [p('chest'), s('triceps', 0.5), s('front_delts', 0.5), st('abs', 0.4)], 75, 'Passo à frente e core firme; empurre as mãos para frente e levemente para dentro.'),

  // ====================================================== 2. Costas / Dorsais (25)
  x(21, 'puxada_frontal_aberta', 'Puxada frontal aberta na polia alta (Pulldown)', ['back'], B, [POLIA, BARRA], [p('lats'), s('biceps', 0.6), s('upper_back', 0.6), st('forearms', 0.3)], 90, 'Peito para cima e leve inclinação para trás; puxe com os cotovelos até a barra chegar à parte alta do peito.'),
  x(22, 'puxada_frontal_neutra', 'Puxada frontal com pegada neutra (triângulo)', ['back'], B, [POLIA, TRI], [p('lats'), s('biceps', 0.6), s('upper_back', 0.5)], 90, 'Cotovelos para baixo e junto ao tronco; leve o triângulo até o esterno.'),
  x(23, 'puxada_frontal_supinada', 'Puxada frontal supinada na polia alta', ['back'], B, [POLIA, BARRA], [p('lats'), s('biceps', 0.8), s('upper_back', 0.4)], 90, 'Pegada na largura dos ombros com palmas para você; evite balançar o tronco.'),
  x(24, 'puxada_nuca', 'Puxada atrás da nuca na polia alta', ['back'], A, [POLIA, BARRA], [p('lats'), s('upper_back', 0.6), s('biceps', 0.5), s('rear_delts', 0.4)], 90, 'Só faça se tiver boa mobilidade de ombro; desça até a nuca sem projetar a cabeça à frente.'),
  x(25, 'puxada_unilateral', 'Puxada unilateral na polia alta', ['back'], I, [POLIA, PEG], [p('lats'), s('biceps', 0.6), st('obliques', 0.3)], 75, 'Comece com o braço alongado e puxe o cotovelo em direção ao quadril.'),
  x(26, 'puxada_articulada_convergente', 'Puxada articulada convergente (Hammer High Row)', ['back'], B, [ART], [p('lats'), s('upper_back', 0.6), s('biceps', 0.5)], 90, 'Coxas bem presas; puxe em arco, aproximando as escápulas no final.'),
  x(27, 'puxada_articulada_unilateral', 'Puxada articulada unilateral', ['back'], I, [ART], [p('lats'), s('upper_back', 0.5), s('biceps', 0.5)], 75, 'Um lado por vez para corrigir assimetrias; segure 1 s na contração.'),
  x(28, 'pulldown_bracos_estendidos', 'Pulldown com braços estendidos na polia alta (barra reta)', ['back'], I, [POLIA, BARRA], [p('lats'), s('triceps', 0.3), st('abs', 0.3)], 60, 'Cotovelos quase estendidos e fixos; leve a barra até as coxas usando só o dorsal.'),
  x(29, 'pulldown_corda', 'Pulldown com corda na polia alta', ['back'], I, [POLIA, CORDA], [p('lats'), st('triceps', 0.3)], 60, 'Tronco inclinado à frente; abra a corda ao lado do quadril no final.'),
  x(30, 'remada_baixa_triangulo', 'Remada baixa sentado na polia com triângulo', ['back'], B, [POLIA, TRI], [p('upper_back'), p('lats', 0.9), s('biceps', 0.5), s('rear_delts', 0.4)], 90, 'Coluna neutra e peito aberto; puxe o triângulo até o umbigo sem jogar o tronco para trás.'),
  x(31, 'remada_baixa_barra_pronada', 'Remada baixa sentado na polia com barra reta (pronada)', ['back'], B, [POLIA, BARRA], [p('upper_back'), s('lats', 0.7), s('rear_delts', 0.6), s('biceps', 0.4)], 90, 'Pegada aberta e cotovelos altos; leve a barra à linha do peito para enfatizar a parte alta das costas.'),
  x(32, 'remada_baixa_barra_supinada', 'Remada baixa sentado na polia com barra reta (supinada)', ['back'], B, [POLIA, BARRA], [p('lats'), s('upper_back', 0.6), s('biceps', 0.7)], 90, 'Palmas para cima, cotovelos colados no corpo; puxe até a parte baixa do abdômen.'),
  x(33, 'remada_baixa_unilateral', 'Remada baixa unilateral na polia', ['back'], I, [POLIA, PEG], [p('lats'), s('upper_back', 0.6), s('biceps', 0.5), st('obliques', 0.3)], 75, 'Permita uma leve rotação do tronco para alongar mais no início da repetição.'),
  x(34, 'remada_articulada_neutra', 'Remada articulada sentado (pegada neutra)', ['back'], B, [ART], [p('upper_back'), p('lats', 0.9), s('biceps', 0.5)], 90, 'Peito apoiado no suporte; puxe até as mãos chegarem ao lado das costelas.'),
  x(35, 'remada_articulada_pronada', 'Remada articulada sentado (pegada pronada)', ['back'], B, [ART], [p('upper_back'), s('lats', 0.7), s('rear_delts', 0.6), s('biceps', 0.4)], 90, 'Cotovelos abertos a ~45°; foque em aproximar as escápulas.'),
  x(36, 'hammer_low_row', 'Remada articulada unilateral (Hammer Low Row)', ['back'], I, [ART], [p('lats'), s('upper_back', 0.6), s('biceps', 0.5)], 75, 'Puxe em direção ao quadril e controle a volta até o alongamento completo.'),
  x(37, 'remada_cavalinho_maquina', 'Remada cavalinho na máquina (T-Bar apoiado no peito)', ['back'], I, [MAQ], [p('upper_back'), p('lats', 0.9), s('rear_delts', 0.5), s('biceps', 0.5)], 90, 'Peito colado no apoio o tempo todo; sem tranco para iniciar a puxada.', ['hypertrophy', 'strength']),
  x(38, 'remada_curvada_smith_pronada', 'Remada curvada no Smith (pegada pronada)', ['back'], I, [SMITH], [p('upper_back'), p('lats', 0.9), s('rear_delts', 0.6), s('biceps', 0.5), st('lower_back', 0.5)], 120, 'Tronco a ~45° e coluna neutra; leve a barra até a parte baixa do peito.', ['hypertrophy', 'strength']),
  x(39, 'remada_curvada_smith_supinada', 'Remada curvada no Smith (pegada supinada)', ['back'], I, [SMITH], [p('lats'), s('upper_back', 0.7), s('biceps', 0.7), st('lower_back', 0.5)], 120, 'Palmas para cima e cotovelos junto ao corpo; puxe até o umbigo.', ['hypertrophy', 'strength']),
  x(40, 'remada_alta_polia', 'Remada alta na polia baixa (corda ou barra)', ['back'], I, [POLIA, CORDA], [p('traps'), p('side_delts', 0.8), s('biceps', 0.3)], 60, 'Suba até a linha do peito com os cotovelos acima das mãos; não passe dos ombros.'),
  x(41, 'remada_inclinada_banco_polia', 'Remada inclinada no banco com polia baixa', ['back'], I, [POLIA, BANCO, BARRA], [p('upper_back'), s('lats', 0.7), s('rear_delts', 0.6)], 75, 'Peito apoiado no banco inclinado elimina o roubo com a lombar.'),
  x(42, 'pullover_nautilus', 'Pullover na máquina articulada (Nautilus)', ['back'], I, [ART], [p('lats'), s('chest', 0.4), s('triceps', 0.3)], 75, 'Empurre com os cotovelos, não com as mãos; amplitude máxima no alongamento.'),
  x(43, 'barra_assistida_pronada', 'Barra fixa assistida na máquina (Graviton – pronada)', ['back'], B, [GRAV], [p('lats'), s('biceps', 0.6), s('upper_back', 0.6)], 90, 'Quanto maior a carga de assistência, mais fácil; reduza aos poucos até a barra livre.'),
  x(44, 'barra_assistida_neutra', 'Barra fixa assistida na máquina (Graviton – neutra)', ['back'], B, [GRAV], [p('lats'), s('biceps', 0.7), s('upper_back', 0.5)], 90, 'Pegada neutra é a mais amigável para os ombros; suba até o queixo passar a pegada.'),
  x(45, 'hiperextensao_lombar_maquina', 'Hiperextensão lombar na máquina (Back Extension)', ['back'], B, [MAQ], [p('lower_back'), s('glutes', 0.6), s('hamstrings', 0.5)], 60, 'Estenda até alinhar o tronco às pernas; não hiperestenda a coluna no topo.', ['strength', 'endurance']),

  // ============================================ 3. Ombros / Deltoides e Trapézio (22)
  x(46, 'desenvolvimento_articulado_pronado', 'Desenvolvimento de ombros na máquina articulada (pronada)', ['shoulders'], B, [ART], [p('front_delts'), s('side_delts', 0.6), s('triceps', 0.6)], 90, 'Costas apoiadas e abdômen firme; empurre sem travar os cotovelos no topo.', ['hypertrophy', 'strength']),
  x(47, 'desenvolvimento_articulado_neutro', 'Desenvolvimento de ombros na máquina articulada (neutra)', ['shoulders'], B, [ART], [p('front_delts'), s('triceps', 0.7), s('side_delts', 0.4)], 90, 'Pegada neutra protege o ombro; mantenha os cotovelos à frente do corpo.'),
  x(48, 'desenvolvimento_unilateral_articulado', 'Desenvolvimento unilateral na máquina articulada', ['shoulders'], I, [ART], [p('front_delts'), s('side_delts', 0.5), s('triceps', 0.6), st('obliques', 0.3)], 75, 'Não incline o tronco para o lado; o core segura a assimetria.'),
  x(49, 'desenvolvimento_militar_smith', 'Desenvolvimento militar frontal no Smith', ['shoulders'], I, [SMITH, BANCO], [p('front_delts'), s('side_delts', 0.6), s('triceps', 0.7), st('abs', 0.3)], 120, 'Banco quase a 90°; a barra desce até a altura do queixo, passando à frente do rosto.', ['strength', 'hypertrophy']),
  x(50, 'desenvolvimento_nuca_smith', 'Desenvolvimento atrás da nuca no Smith', ['shoulders'], A, [SMITH, BANCO], [p('side_delts'), p('front_delts', 0.8), s('triceps', 0.6), s('traps', 0.4)], 120, 'Exige mobilidade: desça só até a altura das orelhas e mantenha a cabeça neutra.'),
  x(51, 'arnold_articulado', 'Desenvolvimento Arnold na máquina articulada', ['shoulders'], I, [ART], [p('front_delts'), s('side_delts', 0.6), s('triceps', 0.5)], 75, 'Gire as pegadas de neutra para pronada enquanto sobe; controle a rotação na descida.'),
  x(52, 'elevacao_lateral_maquina', 'Elevação lateral na máquina (Lateral Raise Machine)', ['shoulders'], B, [MAQ], [p('side_delts'), s('traps', 0.3)], 60, 'Empurre os rolos com os cotovelos até a linha dos ombros; ombros longe das orelhas.'),
  x(53, 'elevacao_lateral_maquina_unilateral', 'Elevação lateral unilateral na máquina', ['shoulders'], I, [MAQ], [p('side_delts'), s('traps', 0.3)], 45, 'Segure 1 s no topo; a descida deve durar o dobro da subida.'),
  x(54, 'elevacao_lateral_polia_frente', 'Elevação lateral na polia baixa (pela frente do corpo)', ['shoulders'], I, [POLIA, PEG], [p('side_delts'), s('front_delts', 0.3)], 45, 'Cabo cruzando à frente; suba em arco até a linha do ombro com o cotovelo levemente flexionado.'),
  x(55, 'elevacao_lateral_polia_tras', 'Elevação lateral na polia baixa (por trás do corpo)', ['shoulders'], I, [POLIA, PEG], [p('side_delts'), s('rear_delts', 0.4)], 45, 'Cabo passando atrás do corpo aumenta a tensão no início; não incline o tronco.'),
  x(56, 'elevacao_lateral_crossover', 'Elevação lateral simultânea no crossover (polia baixa)', ['shoulders'], I, [CROSS], [p('side_delts'), s('traps', 0.3)], 60, 'Cabos cruzados, cada mão segura o cabo oposto; abra em "Y" baixo até a altura dos ombros.'),
  x(57, 'elevacao_frontal_polia_barra', 'Elevação frontal na polia baixa com barra reta', ['shoulders'], B, [POLIA, BARRA], [p('front_delts'), s('chest', 0.3)], 60, 'De costas para a polia, cabo entre as pernas; suba até a altura dos olhos sem balançar.'),
  x(58, 'elevacao_frontal_polia_corda', 'Elevação frontal na polia baixa com corda', ['shoulders'], B, [POLIA, CORDA], [p('front_delts'), s('chest', 0.3)], 60, 'Pegada neutra na corda; suba com os braços quase estendidos.'),
  x(59, 'elevacao_frontal_unilateral_polia', 'Elevação frontal unilateral na polia baixa', ['shoulders'], B, [POLIA, PEG], [p('front_delts'), st('obliques', 0.3)], 45, 'Mantenha o quadril parado; suba até a linha do ombro.'),
  x(60, 'crucifixo_inverso_maquina', 'Crucifixo inverso na máquina (Peck Deck invertido)', ['shoulders'], B, [MAQ], [p('rear_delts'), s('upper_back', 0.6), s('traps', 0.3)], 60, 'Peito no encosto e pegadas na altura dos ombros; abra os braços sem juntar demais as escápulas.'),
  x(61, 'crucifixo_inverso_unilateral', 'Crucifixo inverso unilateral na máquina', ['shoulders'], I, [MAQ], [p('rear_delts'), s('upper_back', 0.5)], 45, 'Sente de lado para a máquina e puxe em arco cruzando o corpo.'),
  x(62, 'crucifixo_inverso_polia', 'Crucifixo inverso na polia alta (crossover sem pegador)', ['shoulders'], I, [CROSS], [p('rear_delts'), s('upper_back', 0.6)], 60, 'Segure o cabo pela esfera, cabos cruzados à frente; abra os braços na altura dos ombros.'),
  x(63, 'face_pull_polia', 'Face Pull na polia alta com corda', ['shoulders'], B, [POLIA, CORDA], [p('rear_delts'), s('upper_back', 0.6), s('traps', 0.4)], 60, 'Puxe a corda até o rosto abrindo as mãos e girando os ombros para fora.'),
  x(64, 'remada_alta_smith', 'Remada alta no Smith (pegada aberta)', ['shoulders'], I, [SMITH], [p('side_delts'), p('traps', 0.8), s('biceps', 0.3)], 75, 'Pegada aberta reduz o estresse no ombro; suba só até a linha do peito.'),
  x(65, 'encolhimento_smith', 'Encolhimento de ombros no Smith (Shrug)', ['shoulders'], B, [SMITH], [p('traps'), st('forearms', 0.4)], 60, 'Suba os ombros em direção às orelhas, segure 1 s e desça; não gire os ombros.'),
  x(66, 'encolhimento_articulado', 'Encolhimento de ombros na máquina articulada (Shrug Machine)', ['shoulders'], B, [ART], [p('traps'), st('forearms', 0.4)], 60, 'Braços estendidos o tempo todo; o movimento é só vertical.'),
  x(67, 'encolhimento_polia', 'Encolhimento de ombros na polia baixa', ['shoulders'], B, [POLIA, BARRA], [p('traps'), st('forearms', 0.4)], 60, 'A polia mantém tensão contínua; pausa no topo para maximizar a contração.'),

  // =========================================== 4. Quadríceps, Glúteos e Posteriores (35)
  x(68, 'agachamento_smith', 'Agachamento livre guiado no Smith', ['legs'], I, [SMITH], [p('quads'), p('glutes', 0.8), s('hamstrings', 0.4), s('adductors', 0.4), st('lower_back', 0.4), st('abs', 0.3)], 150, 'Pés levemente à frente da barra; desça até as coxas passarem a paralela com o tronco firme.', ['strength', 'hypertrophy']),
  x(69, 'agachamento_sumo_smith', 'Agachamento sumô no Smith', ['legs'], I, [SMITH], [p('glutes'), p('adductors', 0.9), s('quads', 0.7), s('hamstrings', 0.4)], 120, 'Pés bem afastados e pontas para fora; joelhos acompanham a direção dos pés.'),
  x(70, 'bulgaro_smith', 'Agachamento búlgaro no Smith', ['legs'], I, [SMITH, BANCO], [p('quads'), p('glutes', 0.9), s('adductors', 0.4), st('abs', 0.3)], 90, 'Pé de trás no banco; desça reto até o joelho de trás quase tocar o chão.'),
  x(71, 'agachamento_frontal_smith', 'Agachamento frontal no Smith', ['legs'], A, [SMITH], [p('quads'), s('glutes', 0.6), st('abs', 0.5), st('upper_back', 0.3)], 150, 'Barra apoiada nos deltoides com cotovelos altos; tronco mais vertical que no tradicional.'),
  x(72, 'hack_squat', 'Agachamento Hack na máquina (Hack Squat)', ['legs'], I, [HACK], [p('quads'), s('glutes', 0.6), s('adductors', 0.3)], 120, 'Costas coladas no encosto; pés mais baixos na plataforma enfatizam o quadríceps.', ['hypertrophy', 'strength']),
  x(73, 'hack_invertido', 'Agachamento Hack invertido na máquina', ['legs'], I, [HACK], [p('glutes'), p('quads', 0.8), s('hamstrings', 0.5)], 120, 'De frente para o encosto, quadril vai para trás; ótimo para glúteos com menos carga na lombar.'),
  x(74, 'v_squat', 'Agachamento V-Squat na máquina articulada', ['legs'], I, [ART], [p('quads'), s('glutes', 0.7)], 120, 'Ombros sob as almofadas; desça fundo mantendo os calcanhares no chão.'),
  x(75, 'pendulum_squat', 'Agachamento Pendulum na máquina (Pêndulo)', ['legs'], I, [MAQ], [p('quads'), s('glutes', 0.5)], 120, 'A trajetória em arco permite profundidade máxima; joelhos podem passar a ponta dos pés.'),
  x(76, 'sissy_squat_maquina', 'Agachamento Sissy na máquina (Sissy Squat)', ['legs'], A, [MAQ], [p('quads'), st('abs', 0.4)], 75, 'Canelas presas, quadril estendido; incline para trás flexionando só os joelhos.'),
  x(77, 'leg_press_45', 'Leg Press 45°', ['legs'], B, [LEG], [p('quads'), s('glutes', 0.6), s('adductors', 0.3)], 120, 'Lombar sempre colada no encosto; não trave os joelhos no topo.', ['hypertrophy', 'strength']),
  x(78, 'leg_press_45_unilateral', 'Leg Press 45° unilateral', ['legs'], I, [LEG], [p('quads'), s('glutes', 0.6)], 90, 'Pé no centro da plataforma; desça até onde o quadril não descolar do banco.'),
  x(79, 'leg_press_horizontal', 'Leg Press horizontal na máquina', ['legs'], B, [LEG], [p('quads'), s('glutes', 0.5)], 90, 'Sente com o quadril no fundo do banco; empurre pelos calcanhares.'),
  x(80, 'leg_press_horizontal_unilateral', 'Leg Press horizontal unilateral', ['legs'], I, [LEG], [p('quads'), s('glutes', 0.5)], 75, 'Mantenha o joelho alinhado com o pé durante todo o movimento.'),
  x(81, 'leg_press_vertical', 'Leg Press vertical na máquina', ['legs'], I, [LEG], [p('quads'), s('glutes', 0.6)], 120, 'Amplitude controlada: pare quando o quadril começar a sair do apoio.'),
  x(82, 'cadeira_extensora', 'Cadeira extensora (Leg Extension)', ['legs'], B, [MAQ], [p('quads')], 60, 'Eixo da máquina alinhado ao joelho; estenda totalmente e segure 1 s.'),
  x(83, 'cadeira_extensora_unilateral', 'Cadeira extensora unilateral', ['legs'], B, [MAQ], [p('quads')], 45, 'Ótima para corrigir desequilíbrios; use a mesma carga nas duas pernas.'),
  x(84, 'mesa_flexora', 'Mesa flexora (Lying Leg Curl)', ['legs'], B, [MAQ], [p('hamstrings'), s('calves', 0.3)], 60, 'Quadril colado no banco; leve o rolo até perto do glúteo sem levantar a pelve.'),
  x(85, 'mesa_flexora_unilateral', 'Mesa flexora unilateral', ['legs'], I, [MAQ], [p('hamstrings'), s('calves', 0.3)], 45, 'Descida lenta (3 s) para maior estímulo excêntrico.'),
  x(86, 'cadeira_flexora', 'Cadeira flexora (Seated Leg Curl)', ['legs'], B, [MAQ], [p('hamstrings'), s('calves', 0.3)], 60, 'Trave bem a coxa; incline o tronco à frente para alongar mais os posteriores.'),
  x(87, 'cadeira_flexora_unilateral', 'Cadeira flexora unilateral', ['legs'], I, [MAQ], [p('hamstrings')], 45, 'Mantenha a outra perna relaxada; contraia o posterior no final.'),
  x(88, 'flexora_em_pe', 'Flexora em pé na máquina (Standing Leg Curl)', ['legs'], I, [MAQ], [p('hamstrings'), s('calves', 0.3)], 45, 'Quadril encostado no apoio; não arqueie a lombar para subir o calcanhar.'),
  x(89, 'flexora_ajoelhada', 'Flexora ajoelhada na máquina (Kneeling Leg Curl)', ['legs'], I, [MAQ], [p('hamstrings'), s('glutes', 0.3)], 45, 'Antebraços apoiados e tronco estável; flexione o joelho sem girar o quadril.'),
  x(90, 'cadeira_abdutora', 'Cadeira abdutora', ['legs'], B, [MAQ], [p('glutes', 0.9)], 45, 'Tronco levemente inclinado à frente aumenta o recrutamento do glúteo médio.'),
  x(91, 'cadeira_adutora', 'Cadeira adutora', ['legs'], B, [MAQ], [p('adductors')], 45, 'Comece numa abertura confortável e feche as pernas com controle, sem bater as almofadas.'),
  x(92, 'hip_thrust_maquina', 'Elevação pélvica na máquina (Hip Thrust Machine)', ['legs'], B, [MAQ], [p('glutes'), s('hamstrings', 0.4)], 90, 'Queixo para baixo e costelas fechadas; suba até o quadril alinhar com o tronco.'),
  x(93, 'hip_thrust_smith', 'Elevação pélvica no Smith', ['legs'], I, [SMITH, BANCO], [p('glutes'), s('hamstrings', 0.4), st('quads', 0.3)], 90, 'Escápulas apoiadas no banco e barra com proteção no quadril; pausa de 1 s no topo.', ['hypertrophy', 'strength']),
  x(94, 'gluteo_coice_maquina', 'Glúteo coice na máquina (Glute Kickback Machine)', ['legs'], B, [MAQ], [p('glutes'), s('hamstrings', 0.4)], 45, 'Empurre com o calcanhar para trás e para cima sem arquear a lombar.'),
  x(95, 'gluteo_coice_polia', 'Glúteo coice na polia baixa (com tornozeleira)', ['legs'], B, [POLIA, TORN], [p('glutes'), s('hamstrings', 0.4)], 45, 'Apoie as mãos na máquina e incline o tronco; estenda o quadril sem girar a pelve.'),
  x(96, 'abducao_quadril_polia', 'Abdução de quadril na polia baixa (com tornozeleira)', ['legs'], B, [POLIA, TORN], [p('glutes', 0.9)], 45, 'Perna de apoio levemente flexionada; afaste a perna lateralmente sem inclinar o tronco.'),
  x(97, 'aducao_quadril_polia', 'Adução de quadril na polia baixa (com tornozeleira)', ['legs'], B, [POLIA, TORN], [p('adductors')], 45, 'Cruze a perna à frente da perna de apoio com movimento controlado.'),
  x(98, 'extensao_quadril_polia', 'Extensão de quadril estendida na polia baixa', ['legs'], B, [POLIA, TORN], [p('glutes'), s('hamstrings', 0.6)], 45, 'Perna estendida, leve-a para trás até sentir o glúteo contrair; não compense com a lombar.'),
  x(99, 'stiff_smith', 'Stiff no Smith', ['legs'], I, [SMITH], [p('hamstrings'), s('glutes', 0.7), st('lower_back', 0.6)], 120, 'Joelhos semiflexionados e fixos; desça a barra rente às pernas levando o quadril para trás.'),
  x(100, 'terra_romeno_smith', 'Levantamento terra romeno no Smith', ['legs'], I, [SMITH], [p('hamstrings'), p('glutes', 0.9), s('lower_back', 0.6), st('forearms', 0.4)], 120, 'Movimento de dobradiça de quadril; pare quando a coluna for perder a neutralidade.', ['strength', 'hypertrophy']),
  x(101, 'terra_sumo_smith', 'Levantamento terra sumô no Smith', ['legs'], A, [SMITH], [p('glutes'), p('adductors', 0.8), s('quads', 0.6), s('hamstrings', 0.5), s('lower_back', 0.5)], 150, 'Base larga e mãos por dentro das pernas; empurre o chão e estenda quadril e joelhos juntos.', ['strength']),
  x(102, 'avanco_smith', 'Avanço / passada estacionária no Smith', ['legs'], I, [SMITH], [p('quads'), p('glutes', 0.8), s('adductors', 0.3), st('abs', 0.3)], 90, 'Passos longos favorecem glúteo, curtos o quadríceps; desça na vertical.'),

  // ====================================================== 5. Panturrilhas (8)
  x(103, 'panturrilha_em_pe_maquina', 'Panturrilha em pé na máquina (Standing Calf Raise)', ['calves'], B, [MAQ], [p('calves')], 45, 'Amplitude total: alongue embaixo por 1 s e suba na ponta dos pés.'),
  x(104, 'panturrilha_sentado', 'Panturrilha sentado na máquina (Banco Solear)', ['calves'], B, [MAQ], [p('calves')], 45, 'Joelhos flexionados enfatizam o sóleo; pausas no alongamento e na contração.'),
  x(105, 'panturrilha_leg_45', 'Panturrilha no Leg Press 45°', ['calves'], B, [LEG], [p('calves')], 45, 'Só a ponta dos pés na borda da plataforma; mantenha a trava de segurança à mão.'),
  x(106, 'panturrilha_leg_horizontal', 'Panturrilha no Leg Press horizontal', ['calves'], B, [LEG], [p('calves')], 45, 'Joelhos quase estendidos e fixos; o movimento é só no tornozelo.'),
  x(107, 'panturrilha_smith_step', 'Panturrilha no Smith (com step)', ['calves'], I, [SMITH, STEP], [p('calves')], 45, 'O step aumenta a amplitude; desça o calcanhar abaixo da linha do apoio.'),
  x(108, 'panturrilha_unilateral_smith', 'Panturrilha unilateral no Smith', ['calves'], I, [SMITH, STEP], [p('calves')], 45, 'Uma perna por vez; a barra guiada dá equilíbrio para carregar mais.'),
  x(109, 'panturrilha_hack', 'Panturrilha na máquina Hack', ['calves'], I, [HACK], [p('calves')], 45, 'De frente ou de costas no Hack, com os ombros sob as almofadas e só a ponta do pé apoiada.'),
  x(110, 'panturrilha_burro', 'Panturrilha tipo burro na máquina (Donkey Calf Raise)', ['calves'], I, [MAQ], [p('calves')], 45, 'Quadril flexionado alonga mais o gastrocnêmio; amplitude completa.'),

  // ================================================= 6. Bíceps e Antebraços (16)
  x(111, 'rosca_direta_polia_barra', 'Rosca direta na polia baixa com barra reta', ['biceps'], B, [POLIA, BARRA], [p('biceps'), s('forearms', 0.5)], 60, 'Cotovelos fixos ao lado do corpo; suba sem projetar os ombros à frente.'),
  x(112, 'rosca_direta_polia_w', 'Rosca direta na polia baixa com barra W', ['biceps'], B, [POLIA, BARRA_W], [p('biceps'), s('forearms', 0.5)], 60, 'A barra W alivia os punhos; controle 2–3 s na descida.'),
  x(113, 'rosca_martelo_polia_corda', 'Rosca martelo na polia baixa com corda', ['biceps'], B, [POLIA, CORDA], [p('biceps', 0.8), p('forearms', 0.9)], 60, 'Pegada neutra o tempo todo; trabalha braquial e braquiorradial.'),
  x(114, 'rosca_unilateral_polia', 'Rosca unilateral na polia baixa (com pegador)', ['biceps'], B, [POLIA, PEG], [p('biceps'), s('forearms', 0.4)], 45, 'Supine o punho durante a subida para máxima contração.'),
  x(115, 'rosca_bayesiana', 'Rosca bayesiana na polia baixa (de costas para a polia)', ['biceps'], I, [POLIA, PEG], [p('biceps'), s('forearms', 0.3)], 45, 'Braço atrás do corpo alonga a cabeça longa do bíceps; cotovelo fixo.'),
  x(116, 'rosca_concentrada_polia', 'Rosca concentrada na polia baixa', ['biceps'], B, [POLIA, PEG], [p('biceps')], 45, 'Cotovelo apoiado na parte interna da coxa; contraia e segure 1 s no topo.'),
  x(117, 'rosca_scott_articulada', 'Rosca Scott na máquina articulada (Preacher Curl Machine)', ['biceps'], B, [ART], [p('biceps'), s('forearms', 0.3)], 60, 'Axilas encaixadas no apoio; não estenda totalmente o cotovelo com tranco.'),
  x(118, 'rosca_scott_unilateral', 'Rosca Scott unilateral na máquina', ['biceps'], I, [ART], [p('biceps')], 45, 'Um braço por vez para manter a concentração na contração do bíceps.'),
  x(119, 'rosca_scott_polia', 'Rosca Scott na polia baixa', ['biceps'], I, [POLIA, BANCO, BARRA_W], [p('biceps'), s('forearms', 0.3)], 60, 'Banco Scott de frente para a polia mantém tensão inclusive no topo.'),
  x(120, 'rosca_maquina_articulada', 'Rosca direta na máquina articulada (Biceps Curl Machine)', ['biceps'], B, [ART], [p('biceps'), s('forearms', 0.3)], 60, 'Alinhe o cotovelo ao eixo da máquina antes de começar.'),
  x(121, 'rosca_dupla_polia_alta', 'Rosca dupla na polia alta (Crucifixo de bíceps)', ['biceps'], I, [CROSS, PEG], [p('biceps')], 45, 'Braços abertos na altura dos ombros; flexione levando as mãos às orelhas.'),
  x(122, 'rosca_spider_polia', 'Rosca spider no banco inclinado com polia baixa', ['biceps'], I, [POLIA, BANCO, BARRA_W], [p('biceps')], 45, 'Peito apoiado no banco inclinado e braços pendurados na vertical; sem balanço.'),
  x(123, 'rosca_inversa_polia', 'Rosca inversa na polia baixa com barra reta', ['biceps'], B, [POLIA, BARRA], [p('forearms'), s('biceps', 0.6)], 45, 'Pegada pronada (palmas para baixo); punhos firmes e alinhados.'),
  x(124, 'rosca_punho_polia', 'Rosca punho na polia baixa (flexão de punho)', ['biceps'], B, [POLIA, BARRA], [p('forearms')], 45, 'Antebraços apoiados na coxa; deixe a barra rolar até os dedos e feche a mão.', ['hypertrophy', 'endurance']),
  x(125, 'rosca_punho_inversa_polia', 'Rosca punho inversa na polia baixa (extensão de punho)', ['biceps'], B, [POLIA, BARRA], [p('forearms')], 45, 'Palmas para baixo; movimento curto e controlado só no punho.'),
  x(126, 'rosca_zottman_polia', 'Rosca Zottman na polia baixa', ['biceps'], I, [POLIA, PEG], [p('biceps'), p('forearms', 0.8)], 45, 'Suba com a palma para cima, gire no topo e desça com a palma para baixo.'),

  // ============================================================ 7. Tríceps (14)
  x(127, 'triceps_pulley_barra', 'Tríceps pulley na polia alta com barra reta', ['triceps'], B, [POLIA, BARRA], [p('triceps')], 60, 'Cotovelos colados ao corpo; estenda totalmente e volte até 90°.'),
  x(128, 'triceps_pulley_barra_v', 'Tríceps pulley na polia alta com barra V', ['triceps'], B, [POLIA, 'Barra V'], [p('triceps')], 60, 'A pegada em V deixa o punho neutro; não deixe os ombros subirem.'),
  x(129, 'triceps_pulley_corda', 'Tríceps pulley na polia alta com corda', ['triceps'], B, [POLIA, CORDA], [p('triceps')], 60, 'Abra a corda no final para máxima contração da cabeça lateral.'),
  x(130, 'triceps_pulley_inverso', 'Tríceps pulley inverso (pegada supinada) na polia alta', ['triceps'], B, [POLIA, BARRA], [p('triceps'), st('forearms', 0.3)], 60, 'Palmas para cima com carga moderada; enfatiza a cabeça medial.'),
  x(131, 'triceps_pulley_unilateral', 'Tríceps pulley unilateral na polia alta', ['triceps'], B, [POLIA, PEG], [p('triceps')], 45, 'Um braço por vez; corrija diferenças de força entre os lados.'),
  x(132, 'triceps_frances_polia_baixa', 'Tríceps francês na polia baixa com corda', ['triceps'], I, [POLIA, CORDA], [p('triceps')], 60, 'De costas para a polia, cotovelos apontados para cima; alonga a cabeça longa.'),
  x(133, 'triceps_frances_polia_alta', 'Tríceps francês na polia alta com corda (inclinado à frente)', ['triceps'], I, [POLIA, CORDA], [p('triceps'), st('abs', 0.3)], 60, 'Tronco inclinado à frente e cotovelos ao lado da cabeça; estenda na direção do cabo.'),
  x(134, 'triceps_testa_polia', 'Tríceps testa no banco com polia baixa', ['triceps'], I, [POLIA, BANCO, BARRA_W], [p('triceps')], 60, 'Cotovelos apontados para o teto e fixos; a barra vai até a testa.'),
  x(135, 'triceps_coice_polia', 'Tríceps coice na polia baixa (sem pegador ou estribo)', ['triceps'], B, [POLIA], [p('triceps')], 45, 'Braço paralelo ao chão e colado ao tronco; estenda o antebraço para trás.'),
  x(136, 'triceps_maquina_articulada', 'Tríceps na máquina articulada (Triceps Extension Machine)', ['triceps'], B, [ART], [p('triceps')], 60, 'Ajuste o assento para o cotovelo alinhar com o eixo; estenda sem tirar o braço do apoio.'),
  x(137, 'mergulho_maquina', 'Mergulho na máquina articulada (Seated Dip Machine)', ['triceps'], B, [ART], [p('triceps'), s('chest', 0.5), s('front_delts', 0.4)], 75, 'Tronco ereto foca o tríceps; empurre as pegadas para baixo até estender os braços.', ['hypertrophy', 'strength']),
  x(138, 'paralelas_assistidas', 'Paralelas assistidas na máquina (Graviton)', ['triceps'], B, [GRAV], [p('triceps'), s('chest', 0.6), s('front_delts', 0.5)], 75, 'Desça até os braços formarem 90°; reduza a assistência conforme evolui.'),
  x(140, 'triceps_cruzado_polia', 'Tríceps cruzado na polia alta (Cross Cable Triceps)', ['triceps'], I, [CROSS], [p('triceps')], 45, 'Cabos cruzados na altura do rosto; estenda os braços para os lados e para baixo.'),

  // ====================================================== 8. Abdômen e Core (10)
  x(141, 'abdominal_crunch_articulado', 'Abdominal crunch na máquina articulada', ['core'], B, [ART], [p('abs'), s('obliques', 0.4)], 45, 'Enrole a coluna aproximando costelas da pelve; não puxe com os braços.'),
  x(142, 'abdominal_infra_maquina', 'Abdominal infra na máquina articulada (elevação de pernas)', ['core'], B, [ART], [p('abs'), s('obliques', 0.4)], 45, 'Leve os joelhos ao peito tirando levemente o quadril do apoio.'),
  x(143, 'abdominal_polia_ajoelhado', 'Abdominal crunch ajoelhado na polia alta com corda', ['core'], B, [POLIA, CORDA], [p('abs'), s('obliques', 0.4)], 45, 'Quadril parado; flexione a coluna levando os cotovelos em direção às coxas.'),
  x(144, 'abdominal_polia_em_pe', 'Abdominal crunch em pé na polia alta com corda', ['core'], I, [POLIA, CORDA], [p('abs'), s('obliques', 0.4)], 45, 'De costas para a polia, corda atrás da cabeça; flexione o tronco sem dobrar o quadril.'),
  x(145, 'rotacao_tronco_maquina', 'Rotação de tronco na máquina (Torso Rotation)', ['core'], B, [MAQ], [p('obliques'), s('abs', 0.4)], 45, 'Quadril fixo; gire o tronco devagar e sem embalo, dos dois lados.'),
  x(146, 'woodchopper_alto_baixo', 'Woodchopper (lenhador) na polia alta para baixa', ['core'], I, [POLIA, PEG], [p('obliques'), s('abs', 0.6), st('front_delts', 0.3)], 45, 'Braços quase estendidos; a rotação vem do tronco e do quadril, não dos braços.', ['conditioning', 'strength']),
  x(147, 'woodchopper_baixo_alto', 'Woodchopper (lenhador) na polia baixa para alta', ['core'], I, [POLIA, PEG], [p('obliques'), s('abs', 0.6), st('glutes', 0.3)], 45, 'Comece agachado ao lado da polia e termine com os braços acima do ombro oposto.', ['conditioning', 'strength']),
  x(148, 'pallof_press', 'Pallof Press (anti-rotação) na polia média', ['core'], B, [POLIA, PEG], [p('obliques'), p('abs', 0.8)], 45, 'Empurre o pegador à frente do peito e resista à rotação; segure 2 s estendido.', ['strength', 'endurance']),
  x(149, 'flexao_lateral_polia', 'Flexão lateral de tronco na polia baixa', ['core'], B, [POLIA, PEG], [p('obliques'), s('abs', 0.3)], 45, 'Incline para o lado oposto ao cabo e volte contraindo o oblíquo.'),
  x(150, 'abdominal_declinado_polia', 'Abdominal supra no banco declinado (Smith / polia)', ['core'], I, [BANCO, POLIA], [p('abs'), s('obliques', 0.4)], 45, 'Suba enrolando a coluna até 45°; a carga da polia permite progressão contínua.'),
];

/** Números da lista oficial que apontam para outro cadastro (exercício repetido em dois grupos). */
export const STRENGTH_SHARED_NUMBERS: Record<number, string> = { 139: 'supino_fechado_smith' };

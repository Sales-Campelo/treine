import { BANCO, BARRA, c, CaliPt, CAIXA, ELASTICO, PARALELAS, PC, RODA } from './types';

export const PART1: CaliPt[] = [
  c('3_4_sit_up', 'Abdominal 3/4 (Sit-Up parcial)', ['core'], [PC], 'Desça só ¾ do caminho para manter o abdômen sob tensão o tempo todo.', [
    'Deite no chão com os joelhos flexionados e os pés presos.',
    'Mãos atrás ou ao lado da cabeça, costas apoiadas no chão.',
    'Flexione quadril e coluna até o tronco ficar perpendicular ao chão.',
    'Volte descendo apenas ¾ do caminho e repita.',
  ]),
  c('ab_roller', 'Roda abdominal (Ab Roller)', ['core'], [RODA], 'Vá só até onde conseguir sem arquear a lombar; abdômen contraído o tempo todo.', [
    'Ajoelhado, segure a roda com as duas mãos apoiada no chão à frente (posição de quatro apoios).',
    'Role a roda para frente devagar, alongando o corpo em linha reta, inspirando.',
    'Desça o máximo possível sem encostar o corpo no chão e faça uma pausa.',
    'Puxe de volta à posição inicial expirando, sem perder a contração do abdômen.',
  ]),
  c('air_bike', 'Bicicleta no ar (Air Bike)', ['core'], [PC], 'Gire o tronco de verdade — leve o ombro ao joelho, não só o cotovelo.', [
    'Deitado, lombar colada no chão, mãos ao lado da cabeça e ombros elevados como num abdominal.',
    'Joelhos a 90° com as canelas paralelas ao chão.',
    'Pedale: estenda a perna direita enquanto traz o joelho esquerdo e aproxime o cotovelo direito dele, expirando.',
    'Alterne os lados continuamente até completar as repetições.',
  ]),
  c('alternate_heel_touchers', 'Toque alternado nos calcanhares', ['core'], [PC], 'Flexione lateralmente o tronco; o pescoço fica relaxado.', [
    'Deitado com os joelhos flexionados, pés no chão afastados ~50 cm e braços ao lado do corpo.',
    'Eleve levemente o tronco e incline para a direita até tocar o calcanhar direito; segure 1 s.',
    'Volte ao centro e repita para a esquerda. Os dois lados contam 1 repetição.',
  ]),
  c('alternate_leg_diagonal_bound', 'Salto diagonal alternado (Bound)', ['plyo', 'legs'], [PC], 'Impulsione forte e aterrisse amortecendo com o joelho semiflexionado.', [
    'Fique em base confortável com um pé ligeiramente à frente.',
    'Impulsione com a perna da frente levando o joelho oposto para frente e para cima.',
    'Salte em diagonal cobrindo a maior distância possível para o lado.',
    'Alterne as pernas a cada salto (uma linha no chão ajuda a medir a distância).',
  ]),
  c('band_assisted_pull_up', 'Barra fixa assistida com elástico', ['back'], [BARRA, ELASTICO], 'Troque por elásticos mais finos conforme evolui até fazer a barra livre.', [
    'Prenda o elástico no centro da barra e apoie um joelho dobrado no laço.',
    'Pegada média a aberta na barra.',
    'Puxe o corpo contraindo o dorsal e levando os cotovelos ao lado do corpo até o queixo passar a barra.',
    'Desça com controle, sem balanço.',
  ]),
  c('bench_dips', 'Mergulho no banco (Bench Dips)', ['triceps'], [BANCO], 'Cotovelos apontando para trás e próximos; quadril perto do banco.', [
    'De costas para o banco, apoie as mãos na borda na largura dos ombros, braços estendidos e pernas à frente.',
    'Flexione os cotovelos e desça até o braço formar pouco menos de 90°.',
    'Empurre com o tríceps de volta à posição inicial.',
  ]),
  c('bench_jump', 'Salto sobre o banco', ['plyo', 'legs'], [BANCO], 'Aterrisse macio, com joelhos flexionados, absorvendo o impacto.', [
    'Fique a 30–60 cm do banco com os pés na largura dos ombros.',
    'Faça um meio agachamento levando os braços para trás.',
    'Salte estendendo quadril, joelhos e tornozelos e passe por cima do banco.',
    'Aterrisse com os joelhos flexionados, vire e salte de volta.',
  ]),
  c('bent_knee_hip_raise', 'Elevação de quadril com joelhos flexionados', ['core'], [PC], 'Use o abdômen inferior para enrolar a pelve; movimento lento.', [
    'Deitado, braços ao lado do corpo, joelhos a ~75° e pés levemente fora do chão.',
    'Traga os joelhos em direção ao peito enrolando a pelve até tirar o quadril do chão, expirando.',
    'Contraia 1 s no topo e desça devagar inspirando.',
  ]),
  c('body_up', 'Body-Up (prancha para apoio)', ['triceps', 'core'], [PC], 'Tronco rígido como numa prancha durante todo o movimento.', [
    'Comece em prancha sobre os antebraços, afastados na largura dos ombros.',
    'Pressione as palmas no chão e estenda os cotovelos para elevar o corpo.',
    'Desça os antebraços de volta ao chão com controle e repita.',
  ]),
  c('body_tricep_press', 'Extensão de tríceps com peso corporal', ['triceps'], [BARRA], 'Quanto mais longe da barra estiverem os pés, mais difícil.', [
    'Com uma barra na altura do peito, segure na largura dos ombros e afaste os pés para trás, inclinando-se sobre ela.',
    'Flexione os cotovelos aproximando a testa da barra.',
    'Faça uma pausa e estenda os cotovelos voltando à posição inicial.',
  ]),
  c('bodyweight_mid_row', 'Remada com peso corporal na barra (pernas apoiadas)', ['back'], [BARRA], 'Retraia as escápulas antes de flexionar os cotovelos.', [
    'Pegada média a aberta na barra, palmas para frente; suspenso, leve os joelhos ao peito e apoie as pernas sobre a barra.',
    'Com os braços estendidos, flexione os cotovelos e aproxime as escápulas até as pernas tocarem a barra.',
    'Pausa breve e volte à posição inicial.',
  ]),
  c('bodyweight_squat', 'Agachamento livre (peso corporal)', ['legs'], [PC], 'Peito aberto, cabeça erguida e joelhos empurrados para fora.', [
    'Em pé com os pés na largura dos ombros, mãos atrás da cabeça.',
    'Flexione joelhos e quadril, sentando para trás.',
    'Desça até a profundidade máxima que conseguir e suba rapidamente.',
  ]),
  c('bodyweight_walking_lunge', 'Avanço caminhando (peso corporal)', ['legs'], [PC], 'Tronco ereto e joelho da frente alinhado sobre o pé.', [
    'Em pé, pés na largura dos ombros e mãos na cintura.',
    'Dê um passo à frente e desça até o joelho de trás quase tocar o chão.',
    'Empurre pelo calcanhar da frente para subir.',
    'Traga o pé de trás à frente e repita com a outra perna.',
  ]),
  c('bottoms_up', 'Bottoms Up (elevação de pernas e quadril)', ['core'], [PC], 'Eleve o quadril com o abdômen, sem impulso.', [
    'Deitado de costas, pernas estendidas e braços ao lado do corpo.',
    'Traga os joelhos ao peito e estenda as pernas para cima, perpendiculares ao chão.',
    'Gire a pelve e tire os glúteos do chão; pausa breve e volte.',
  ]),
  c('box_jump_multiple_response', 'Salto na caixa (repetições contínuas)', ['plyo', 'legs'], [CAIXA], 'Use os braços para gerar impulso; aterrisse com os dois pés juntos.', [
    'Fique de frente para a caixa a um braço de distância, braços ao lado do corpo e pernas levemente flexionadas.',
    'Salte para cima e para frente usando os braços e aterrisse com os dois pés sobre a caixa.',
    'Desça ou salte de volta imediatamente e repita a sequência.',
  ]),
  c('box_skip', 'Skip em caixas', ['plyo', 'legs'], [CAIXA], 'Busque altura com o quadril em cada impulsão.', [
    'Alinhe caixas a ~2,5 m de distância; comece de frente para a primeira com uma perna atrás.',
    'Impulsione com a perna de trás e suba na caixa buscando altura.',
    'Ao aterrissar, impulsione a outra perna para frente e para cima, saltando da caixa.',
    'Aterrisse entre as caixas, caminhe até a próxima e repita.',
  ]),
  c('butt_ups', 'Butt-Ups (prancha elevando o quadril)', ['core'], [PC], 'Não deixe a lombar afundar na volta.', [
    'Em prancha sobre os antebraços, cotovelos a 90°.',
    'Eleve o quadril em direção ao teto contraindo o abdômen, até formar um "V" invertido, expirando.',
    'Desça devagar até a prancha, inspirando, e repita.',
  ]),
  c('butt_lift_bridge', 'Ponte de glúteos (Bridge)', ['legs'], [PC], 'Empurre pelos calcanhares e segure 1 s no topo.', [
    'Deitado de costas, mãos ao lado do corpo, joelhos flexionados e pés na largura dos ombros.',
    'Empurrando pelos calcanhares, eleve o quadril mantendo as costas retas, expirando.',
    'Segure 1 s no topo e desça devagar inspirando.',
  ]),
  c('carioca_quick_step', 'Passo carioca rápido', ['plyo', 'legs'], [PC], 'Olhe sempre para frente e não gire os pés durante o deslocamento.', [
    'Pés próximos e braço esquerdo para cima, em postura atlética relaxada.',
    'Com o pé direito, dê um passo rápido por trás e eleve o joelho.',
    'Movimente os braços junto com o joelho e desloque-se lateralmente.',
  ]),
  c('chin_up', 'Barra fixa supinada (Chin-Up)', ['back', 'biceps'], [BARRA], 'Cotovelos junto ao corpo e tronco estável — só os braços se movem.', [
    'Segure a barra com as palmas voltadas para você, pegada mais fechada que os ombros.',
    'Braços estendidos, peito aberto e leve curvatura na lombar.',
    'Puxe até a cabeça chegar à altura da barra, focando no bíceps, expirando.',
    'Segure 1 s e desça devagar até estender os braços.',
  ]),
  c('clock_push_up', 'Flexão relógio (Clock Push-Up)', ['chest', 'plyo'], [PC], 'Corpo reto do início ao fim; gire ~30° a cada salto.', [
    'Em posição de flexão, braços estendidos e mãos na largura dos ombros.',
    'Desça flexionando os cotovelos até o peito se aproximar do chão.',
    'Empurre explosivamente até sair do chão, deslocando o corpo ~30° para o lado.',
    'Repita girando até voltar ao ponto de partida.',
  ]),
  c('cocoons', 'Casulo (Cocoons)', ['core'], [PC], 'Junte joelhos e braços ao mesmo tempo, como se fechasse um casulo.', [
    'Deitado de costas, pernas estendidas e braços estendidos atrás da cabeça.',
    'Traga os joelhos ao peito tirando os glúteos do chão enquanto flexiona a coluna e traz os braços por cima da cabeça.',
    'Pausa breve e volte à posição inicial.',
  ]),
  c('cross_body_crunch', 'Abdominal cruzado (Cross-Body Crunch)', ['core'], [PC], 'Leve o ombro em direção ao joelho — o abdômen faz o trabalho, não o cotovelo.', [
    'Deitado, joelhos flexionados a ~60°, pés no chão e mãos soltas atrás da cabeça.',
    'Suba levando o cotovelo e ombro direitos em direção ao joelho esquerdo, que vem ao encontro, expirando.',
    'Volte inspirando e repita para o outro lado, alternando.',
  ]),
  c('crunch_hands_overhead', 'Abdominal com braços estendidos acima da cabeça', ['core'], [PC], 'Braços alinhados com cabeça e pescoço durante todo o movimento.', [
    'Deitado, joelhos a ~60° e pés no chão; estenda os braços acima da cabeça com as palmas cruzadas.',
    'Enrole o tronco tirando as escápulas do chão sem mover os braços; segure 1 s, expirando.',
    'Desça devagar inspirando.',
  ]),
  c('crunches', 'Abdominal supra (Crunch)', ['core'], [PC], 'Pressione a lombar no chão; ombros sobem só ~10 cm.', [
    'Deitado, pés no chão e joelhos flexionados; mãos ao lado da cabeça, sem entrelaçar os dedos.',
    'Pressione a lombar no chão e enrole os ombros para cima contraindo o abdômen, expirando.',
    'Segure a contração 1 s no topo.',
    'Desça devagar inspirando, sem usar impulso.',
  ]),
  c('dead_bug', 'Dead Bug (inseto morto)', ['core'], [PC], 'A lombar não pode sair do chão — se arquear, diminua a amplitude.', [
    'Deitado de costas com os braços estendidos para o teto.',
    'Eleve pés, joelhos e quadril a 90°; expire forte e cole a lombar no chão.',
    'Estenda uma perna até quase tocar o chão, mantendo a pelve e a lombar fixas.',
    'Volte e repita do outro lado, alternando.',
  ]),
  c('decline_crunch', 'Abdominal no banco declinado', ['core'], [BANCO], 'Movimento lento e controlado, sem impulso.', [
    'Prenda as pernas no fim do banco declinado e deite.',
    'Mãos ao lado da cabeça; pressione a lombar no banco e enrole os ombros para cima, expirando.',
    'Contraia forte 1 s no topo e desça devagar inspirando.',
  ]),
  c('decline_oblique_crunch', 'Abdominal oblíquo no banco declinado', ['core'], [BANCO], 'Gire o tronco de verdade para sentir o oblíquo.', [
    'Prenda as pernas no banco declinado e eleve o tronco a ~40° do chão.',
    'Uma mão ao lado da cabeça e a outra na coxa.',
    'Suba girando o tronco até o cotovelo encostar no joelho oposto; segure 1 s, expirando.',
    'Desça devagar e, ao fim da série, troque de lado.',
  ]),
  c('decline_push_up', 'Flexão declinada (pés elevados)', ['chest'], [CAIXA], 'Ênfase na parte alta do peito; não deixe o quadril cair.', [
    'Mãos no chão afastadas ~90 cm e pés sobre um banco ou caixa.',
    'Desça até o peito quase tocar o chão, inspirando.',
    'Empurre de volta contraindo o peito, expirando; pausa breve no topo.',
  ]),
  c('decline_reverse_crunch', 'Abdominal reverso no banco declinado', ['core'], [BANCO], 'Enrole a pelve — os joelhos chegam ao peito no final.', [
    'Deitado no banco declinado, segure a parte de cima com as duas mãos.',
    'Pernas quase estendidas e paralelas ao chão, joelhos e pés juntos.',
    'Traga as pernas em direção ao tronco enrolando a pelve e tirando o quadril do banco, expirando.',
    'Segure 1 s e volte devagar inspirando.',
  ]),
  c('depth_jump_leap', 'Salto em profundidade para caixa alta', ['plyo', 'legs'], [CAIXA], 'Minimize o tempo no chão: caia e salte imediatamente.', [
    'Use duas caixas: uma de 30–40 cm e outra de 55–65 cm, a ~70 cm uma da outra.',
    'Em pé sobre a caixa baixa, pés juntos na borda.',
    'Caia da caixa e, ao tocar o chão, salte imediatamente com os dois pés.',
    'Use braços e extensão total do corpo para aterrissar na caixa alta, amortecendo com as pernas.',
  ]),
  c('dips_chest_version', 'Paralelas – ênfase no peito', ['chest'], [PARALELAS], 'Tronco inclinado ~30° à frente e cotovelos levemente abertos.', [
    'Sustente o corpo com os braços estendidos acima das paralelas.',
    'Desça devagar inclinando o tronco ~30° à frente até sentir o peito alongar, inspirando.',
    'Suba usando o peito, expirando, e contraia 1 s no topo.',
  ]),
  c('dips_triceps_version', 'Paralelas – ênfase no tríceps', ['triceps'], [PARALELAS], 'Tronco ereto e cotovelos colados ao corpo.', [
    'Sustente o corpo com os braços quase estendidos acima das paralelas.',
    'Desça devagar com o tronco ereto até o cotovelo formar 90°, inspirando.',
    'Empurre com o tríceps de volta ao topo, expirando.',
  ]),
  c('donkey_calf_raises', 'Panturrilha "burro" (Donkey Calf Raise)', ['calves'], [CAIXA], 'Joelhos fixos; amplitude completa do alongamento à ponta dos pés.', [
    'Incline o tronco à frente com o quadril flexionado e apoie as mãos; pontas dos pés sobre um degrau, calcanhares para fora.',
    'Eleve os calcanhares o máximo possível, expirando; segure 1 s.',
    'Desça devagar até alongar bem a panturrilha, inspirando.',
  ]),
  c('double_leg_butt_kick', 'Salto com calcanhares no glúteo', ['plyo', 'legs'], [PC], 'Aterrisse com os joelhos parcialmente flexionados.', [
    'Em pé com os joelhos levemente flexionados.',
    'Agache rapidamente e salte o mais alto possível.',
    'No ar, flexione os joelhos tentando tocar os calcanhares nos glúteos.',
    'Aterrisse amortecendo com as pernas.',
  ]),
  c('drop_push', 'Flexão com queda (Drop Push)', ['chest', 'plyo'], [CAIXA], 'Absorva o impacto com os braços, sem travar os cotovelos.', [
    'Coloque duas plataformas baixas a 60–90 cm e fique em flexão com as mãos sobre elas.',
    'Empurre e solte as mãos das plataformas, caindo com as mãos no chão na largura dos ombros.',
    'Amorteça a queda flexionando os braços e volte às plataformas.',
  ]),
  c('elbow_to_knee', 'Cotovelo ao joelho (abdominal oblíquo)', ['core'], [PC], 'Gire o tronco, não puxe o pescoço com as mãos.', [
    'Deitado, cruze a perna direita sobre o joelho esquerdo flexionado; mãos atrás da cabeça.',
    'Flexione e gire o tronco levando o cotovelo esquerdo ao joelho direito.',
    'Volte e repita; ao fim da série, troque de lado.',
  ]),
];

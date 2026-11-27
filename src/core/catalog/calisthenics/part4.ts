import { ARGOLAS, BARRA, c, CaliPt, CAIXA, CONES, PC } from './types';

export const PART4: CaliPt[] = [
  c('single_leg_hop_progression', 'Saltos unipodais sobre cones', ['plyo', 'legs'], [CONES], 'Aterrisse e salte com a mesma perna, sem apoiar a outra.', [
    'Enfileire cones à frente e fique equilibrado sobre uma perna, joelho oposto elevado.',
    'Salte para frente por cima do cone, aterrissando com a mesma perna.',
    'Use o contramovimento para emendar os saltos de cone em cone.',
    'No fim, vire e volte com a outra perna.',
  ]),
  c('single_leg_lateral_hop', 'Salto lateral unipodal', ['plyo', 'legs'], [CONES], 'Joelho levemente flexionado e rebote imediato.', [
    'Fique de lado para um cone, apoiado em uma perna com o joelho levemente flexionado.',
    'Salte lateralmente por cima do cone.',
    'Aterrisse com a mesma perna e salte imediatamente de volta. Continue indo e voltando.',
  ]),
  c('single_leg_stride_jump', 'Salto unipodal com pé na caixa', ['plyo', 'legs'], [CAIXA], 'Leve o joelho oposto para cima e use os braços para ganhar altura.', [
    'De lado para a caixa, apoie o pé de dentro sobre ela, perto da borda.',
    'Balance os braços para cima e empurre com a perna de cima, saltando o mais alto possível.',
    'Aterrisse na mesma posição, desacelerando com a perna da caixa.',
  ]),
  c('single_leg_butt_kick', 'Salto unipodal com calcanhar no glúteo', ['plyo', 'legs'], [PC], 'A perna livre fica parada durante todo o drill.', [
    'Em pé sobre uma perna, com o outro joelho elevado.',
    'Salte estendendo quadril, joelho e tornozelo da perna de apoio.',
    'No ar, flexione o joelho tentando tocar o calcanhar no glúteo.',
    'Volte a perna para baixo do quadril e aterrisse.',
  ]),
  c('single_leg_glute_bridge', 'Ponte de glúteo unilateral', ['legs'], [PC], 'Empurre pelo calcanhar e mantenha o quadril nivelado.', [
    'Deitado com os pés no chão e joelhos flexionados.',
    'Tire uma perna do chão puxando o joelho ao peito.',
    'Empurre pelo calcanhar da perna de apoio estendendo o quadril e tirando os glúteos do chão.',
    'Suba o máximo possível, pause e volte.',
  ]),
  c('single_leg_push_off', 'Impulsão unipodal na caixa', ['plyo', 'legs'], [CAIXA], 'Estenda totalmente quadril e joelho para ganhar altura.', [
    'Em pé no chão com um pé apoiado na caixa, calcanhar perto da borda.',
    'Impulsione com o pé de cima buscando a maior altura possível.',
    'Aterrisse com o mesmo pé na caixa e o outro de volta no chão.',
  ]),
  c('sit_up', 'Abdominal completo (Sit-Up)', ['core'], [PC], 'Não puxe a cabeça com as mãos; suba com o abdômen.', [
    'Deitado com os joelhos flexionados e os pés presos sob algo firme.',
    'Mãos entrelaçadas atrás da cabeça.',
    'Eleve o tronco até formar um "V" com as coxas, expirando; segure 1 s.',
    'Desça devagar até a posição inicial, inspirando.',
  ]),
  c('spider_crawl', 'Prancha aranha (Spider Crawl)', ['core'], [PC], 'Gire a perna para fora e leve o joelho o mais perto do cotovelo possível.', [
    'Em prancha com os braços flexionados a 90°, pés juntos e corpo reto.',
    'Tire um pé do chão, gire a perna para fora e leve o joelho em direção ao cotovelo do mesmo lado.',
    'Volte e repita do outro lado.',
  ]),
  c('split_jump', 'Salto em afundo (Split Jump)', ['plyo', 'legs'], [PC], 'Joelho da frente sobre o meio do pé; amorteça voltando ao afundo.', [
    'Em posição de afundo: joelho da frente flexionado e o de trás quase no chão.',
    'Estenda as duas pernas e salte o mais alto possível balançando os braços.',
    'No ar, junte os pés e volte-os à posição inicial ao aterrissar.',
    'Amorteça o impacto voltando ao afundo.',
  ]),
  c('standing_long_jump', 'Salto horizontal parado', ['plyo', 'legs'], [PC], 'Use o balanço dos braços; de preferência em superfície macia.', [
    'Em meio agachamento com os pés na largura dos ombros.',
    'Com um grande balanço de braços e contramovimento das pernas, salte para frente o mais longe possível.',
    'Aterrisse com os pés à frente do corpo.',
    'Meça a distância para acompanhar a evolução.',
  ]),
  c('standing_towel_triceps_extension', 'Extensão de tríceps com toalha', ['triceps'], [PC], 'Cotovelos junto à cabeça e apontados para cima.', [
    'Em pé, segure uma ponta da toalha com as duas mãos e estenda os braços acima da cabeça.',
    'Um parceiro segura a outra ponta atrás de você aplicando resistência.',
    'Desça as mãos atrás da cabeça flexionando os cotovelos, sem afastá-los da cabeça.',
    'Estenda os braços de volta contra a resistência.',
  ]),
  c('star_jump', 'Salto estrela (Star Jump)', ['plyo', 'legs'], [PC], 'Abra braços e pernas no ar e feche antes de aterrissar.', [
    'Em pé, pés na largura dos ombros e braços junto ao corpo.',
    'Agache até a metade e exploda para cima o mais alto possível.',
    'No ar, abra braços e pernas formando uma estrela.',
    'Feche os membros e aterrisse amortecendo com as pernas.',
  ]),
  c('step_up_with_knee_raise', 'Subida no banco com elevação de joelho', ['legs'], [CAIXA], 'Suba empurrando com a perna da frente; leve o outro joelho bem alto.', [
    'De frente para uma caixa ou banco, pés juntos.',
    'Suba com o pé esquerdo e estenda quadril e joelho para ficar em pé sobre o banco.',
    'Ao subir, eleve o joelho direito o mais alto possível.',
    'Desça e repita com a outra perna.',
  ]),
  c('stride_jump_crossover', 'Salto cruzado sobre a caixa', ['plyo', 'legs'], [CAIXA], 'Impulsione com a perna de cima e troque de lado no ar.', [
    'De lado para a caixa, com o pé de dentro sobre ela.',
    'Balance os braços e empurre com a perna de cima, saltando o mais alto possível.',
    'Aterrisse do outro lado da caixa: o pé que estava em cima vai ao chão e o outro sobe.',
    'Repita cruzando de volta.',
  ]),
  c('suspended_fallout', 'Fallout nas fitas de suspensão', ['core'], [ARGOLAS], 'Coluna neutra: só os ombros se movem; não deixe o quadril cair.', [
    'Ajuste as alças abaixo da cintura e segure-as em pé, inclinando-se até a posição de flexão inclinada.',
    'Com os braços estendidos, incline-se mais deixando os braços subirem por cima da cabeça.',
    'Mantenha o corpo reto e volte puxando os braços para baixo com o abdômen.',
  ]),
  c('suspended_push_up', 'Flexão nas fitas de suspensão', ['chest'], [ARGOLAS], 'Tronco rígido; a instabilidade trabalha mais os estabilizadores.', [
    'Prenda as fitas no alto, segure as alças e incline-se até a posição de prancha, o mais paralelo ao chão possível.',
    'Desça devagar flexionando os cotovelos, com o tronco rígido.',
    'Passe de 90° nos cotovelos, pause e estenda de volta.',
  ]),
  c('suspended_reverse_crunch', 'Abdominal reverso nas fitas', ['core'], [ARGOLAS], 'Quadril não pode afundar na prancha inicial.', [
    'Alças a ~30 cm do chão; fique em prancha de costas para o suporte com os pés nas alças.',
    'Flexione joelhos e quadril trazendo os joelhos ao tronco, enrolando a coluna.',
    'Volte à prancha com controle.',
  ]),
  c('suspended_row', 'Remada nas fitas de suspensão', ['back'], [ARGOLAS], 'Corpo ereto, peito aberto; quanto mais inclinado, mais difícil.', [
    'Alças na altura do peito; segure uma em cada mão e incline-se para trás com os braços estendidos.',
    'Flexione os cotovelos puxando o peito até as mãos.',
    'Pause no topo e volte com controle.',
  ]),
  c('suspended_split_squat', 'Afundo búlgaro nas fitas de suspensão', ['legs'], [ARGOLAS], 'Peso no calcanhar da frente e peito erguido.', [
    'Alças a 45–75 cm do chão; de costas para elas, coloque o pé de trás na alça.',
    'Olhar à frente, peito erguido e joelho levemente flexionado.',
    'Desça flexionando joelho e quadril, com o peso no calcanhar da frente.',
    'Suba estendendo quadril e joelho. Troque de perna.',
  ]),
  c('tuck_crunch', 'Abdominal grupado (Tuck Crunch)', ['core'], [PC], 'Pernas paradas no alto; só o tronco sobe.', [
    'Deitado, tornozelos cruzados e coxas perpendiculares ao chão com leve flexão dos joelhos.',
    'Braços cruzados sobre o peito.',
    'Eleve o tronco em direção aos joelhos, expirando.',
    'Desça devagar inspirando.',
  ]),
  c('v_bar_pullup', 'Barra com triângulo (pegada neutra)', ['back'], [BARRA], 'Peito aberto e leve inclinação para trás para ativar o dorsal.', [
    'Encaixe o triângulo no meio da barra fixa e segure os pegadores, suspenso.',
    'Peito para fora e corpo levemente inclinado para trás.',
    'Puxe com o dorsal até o peito chegar perto do triângulo, expirando.',
    'Desça devagar até estender os braços.',
  ]),
  c('wide_grip_rear_pull_up', 'Barra aberta atrás da nuca', ['back'], [BARRA], 'Exige boa mobilidade de ombro; não force a amplitude.', [
    'Pegada pronada aberta; incline tronco e cabeça à frente alinhando a nuca com a barra.',
    'Puxe até a barra chegar perto da nuca, levando ombros e braços para baixo e para trás, expirando.',
    'Segure 1 s e desça devagar.',
  ]),
  c('wind_sprints', 'Sprint suspenso na barra (Wind Sprints)', ['core'], [BARRA], 'Sem balançar: só as pernas se movem, alternando rápido.', [
    'Suspenso na barra com pegada pronada, braços e pernas estendidos.',
    'Eleve rapidamente um joelho o mais alto possível.',
    'Ao baixar essa perna, eleve o joelho oposto ao mesmo tempo.',
    'Alterne até completar a série.',
  ]),
  c('superman', 'Super-Homem (Superman)', ['back', 'mobility'], [PC], 'Segure 2 s no alto contraindo lombar e glúteos.', [
    'Deitado de bruços com os braços estendidos à frente.',
    'Eleve ao mesmo tempo braços, pernas e peito do chão e segure 2 s.',
    'Desça devagar inspirando.',
  ]),
  c('split_squats', 'Afundo com troca de pernas (salto)', ['legs', 'plyo'], [PC], 'Desça só um pouco e inverta rapidamente.', [
    'Em pé, salte para a posição de afundo com uma perna à frente e outra atrás, flexionando os joelhos.',
    'Ao descer, inverta imediatamente: suba saltando e troque a posição das pernas.',
    'Repita 5–10 vezes de cada lado.',
  ]),
  c('frog_hops', 'Saltos de sapo (Frog Hops)', ['plyo', 'legs'], [PC], 'Salte para frente, não para o alto; amorteça e emende.', [
    'Mãos atrás da cabeça, agache mantendo o tronco ereto e a cabeça erguida.',
    'Salte para frente alguns passos, sem subir demais.',
    'Ao tocar o chão, amorteça com as pernas e salte de novo. Repita 5–10 vezes.',
  ]),
  c('inchworm', 'Lagarta (Inchworm)', ['mobility', 'core'], [PC], 'Pernas estendidas: a flexão é só no quadril.', [
    'Em pé com os pés juntos, incline-se com as pernas estendidas e apoie as mãos no chão.',
    'Caminhe com as mãos para frente até ficar em posição de flexão.',
    'Mantendo as mãos no lugar, dê passos curtos com os pés até perto delas.',
    'Repita o ciclo.',
  ]),
  c('groiners', 'Groiners (salto de prancha à virilha)', ['mobility', 'plyo'], [PC], 'Cabeça erguida e quadril baixo ao trazer os pés.', [
    'Comece em posição de flexão.',
    'Salte com as duas pernas levando os pés ao lado das mãos.',
    'Volte à prancha e repita imediatamente, 10–20 vezes.',
  ]),
  c('scissor_kick', 'Tesoura (Scissor Kick)', ['core'], [PC], 'Braços parados e lombar colada no chão.', [
    'Deitado, braços estendidos ao lado com as palmas para baixo.',
    'Eleve as pernas com os joelhos levemente flexionados até os calcanhares ficarem a ~15 cm do chão.',
    'Suba uma perna a ~45° enquanto a outra desce perto do chão.',
    'Alterne continuamente, como uma tesoura.',
  ]),
  c('side_leg_raises', 'Balanço lateral de perna', ['mobility', 'legs'], [PC], 'Aumente a amplitude aos poucos a cada balanço.', [
    'Em pé sobre uma perna, segurando numa cadeira para apoio.',
    'Com a perna estendida, eleve-a para o lado o máximo possível.',
    'Balance de volta cruzando à frente da perna de apoio. Repita 5–10 vezes e troque.',
  ]),
  c('front_leg_raises', 'Balanço frontal de perna', ['mobility', 'legs'], [PC], 'Perna estendida e tronco ereto durante o balanço.', [
    'Em pé ao lado de uma cadeira, segurando com uma mão.',
    'Balance a perna estendida para frente e depois para trás, até onde a flexibilidade permitir.',
    'Repita 5–10 vezes e troque de perna.',
  ]),
  c('rear_leg_raises', 'Elevação de perna para trás em quatro apoios', ['mobility', 'legs'], [PC], 'Estenda quadril e joelho sem arquear a lombar.', [
    'Em quatro apoios, olhando para frente, joelhos a 90°.',
    'Estenda uma perna para cima e para trás, estendendo joelho e quadril.',
    'Repita 5–10 vezes e troque de lado.',
  ]),
  c('pelvic_tilt_into_bridge', 'Báscula pélvica para ponte', ['mobility', 'legs'], [PC], 'Primeiro só o cóccix sobe; depois a coluna inteira, vértebra por vértebra.', [
    'Deitado, pés no chão com os calcanhares sob os joelhos.',
    'Eleve só o cóccix em direção ao teto, alongando a lombar, com o abdômen contraído.',
    'Continue subindo a coluna inteira (exceto o pescoço) até a ponte.',
  ]),
  c('worlds_greatest_stretch', 'Alongamento "Melhor do Mundo"', ['mobility'], [PC], 'Segure cada parte 10–20 s respirando fundo.', [
    'Dê um passo à frente em afundo (pé da frente apoiado, de trás na ponta) e desça até o joelho quase tocar o chão; segure 10–20 s.',
    'Apoie a mão do lado da perna da frente no chão, com o cotovelo junto ao pé, e a outra mão no chão para apoio.',
    'Gire o tronco abrindo o braço de cima para o teto e depois estenda a perna da frente, alongando o posterior.',
    'Volte e repita do outro lado.',
  ]),
  c('arm_circles', 'Círculos com os braços', ['mobility', 'shoulders'], [PC], 'Círculos pequenos e controlados; respire normalmente.', [
    'Em pé, braços estendidos para os lados, paralelos ao chão.',
    'Faça círculos de ~30 cm de diâmetro com os braços por cerca de 10 s.',
    'Inverta o sentido e repita.',
  ]),
  c('crossover_reverse_lunge', 'Afundo reverso com rotação', ['mobility', 'legs'], [PC], 'Gire o tronco por cima da perna da frente na descida.', [
    'Em pé, pés na largura dos ombros.',
    'Dê um passo para trás em afundo e gire o tronco por cima da perna da frente.',
    'Pausa breve, volte e repita do outro lado, alternando.',
  ]),
];

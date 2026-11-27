import { ARGOLAS, BANCO, BARRA, c, CaliPt, CAIXA, CORDA, PARALELAS, PC } from './types';

export const PART3: CaliPt[] = [
  c('leg_pull_in', 'Recolhimento de pernas no chão', ['core'], [PC], 'Contraia o abdômen e segure 1 s com os joelhos no peito.', [
    'Deitado no colchonete, pernas estendidas e mãos ao lado do corpo ou sob os glúteos.',
    'Flexione os joelhos e traga as coxas ao abdômen até os joelhos chegarem à altura do peito, expirando.',
    'Volte estendendo as pernas, inspirando.',
  ]),
  c('linear_depth_jump', 'Salto em profundidade linear', ['plyo', 'legs'], [CAIXA], 'Caia e salte imediatamente; aterrisse macio na outra caixa.', [
    'Use duas caixas a alguns passos uma da outra; suba em uma, de frente para a outra.',
    'Caia suavemente no chão entre elas, flexionando joelhos e quadril.',
    'Exploda estendendo quadril, joelhos e tornozelos e salte para a outra caixa.',
    'Aterrisse macio, absorvendo o impacto com as pernas.',
  ]),
  c('london_bridges', 'London Bridges (descida na corda)', ['back'], [CORDA], 'Corpo reto como uma tábua durante toda a descida e subida.', [
    'Prenda uma corda no alto e suba em uma plataforma firme logo abaixo, segurando a corda.',
    'Mantendo o corpo reto, incline-se para trás descendo mão sobre mão até ficar perpendicular ao chão.',
    'Volte subindo mão sobre mão até a posição inicial.',
  ]),
  c('mixed_grip_chin', 'Barra fixa com pegada mista', ['back', 'biceps'], [BARRA], 'Troque a posição das mãos a cada série para equilibrar os lados.', [
    'Segure a barra pouco mais aberta que os ombros: uma palma para frente e a outra voltada para você.',
    'Puxe o corpo até o queixo passar a barra, expirando; segure 1 s.',
    'Desça devagar inspirando. Na série seguinte, inverta as pegadas.',
  ]),
  c('mountain_climbers', 'Escalador (Mountain Climbers)', ['plyo', 'core'], [PC], 'Quadril na linha dos ombros; troque as pernas o mais rápido possível.', [
    'Em posição de flexão, traga um joelho até ficar sob o quadril.',
    'Troque as pernas explosivamente: estenda a dobrada e traga a outra.',
    'Alterne continuamente por 20–30 s.',
  ]),
  c('muscle_up', 'Muscle-Up nas argolas', ['back', 'triceps'], [ARGOLAS], 'Pegada falsa e transição rápida com as argolas junto às axilas.', [
    'Segure as argolas com pegada falsa e inicie uma barra puxando os cotovelos para o lado do corpo.',
    'No topo da puxada, leve as argolas às axilas e role os ombros à frente, cotovelos para trás.',
    'Estenda os cotovelos para completar o mergulho, com controle.',
    'Desça com cuidado até o chão.',
  ]),
  c('natural_glute_ham_raise', 'Flexão nórdica (Natural Glute-Ham Raise)', ['legs'], [BANCO], 'Desça sob controle; use elástico, parceiro ou caixa para ajudar na volta.', [
    'Prenda os tornozelos sob um apoio (ex.: almofada do pulley ou banco Scott), joelhos no assento, de costas para o aparelho.',
    'Corpo ereto e postura firme.',
    'Desça sob controle até os joelhos ficarem quase estendidos.',
    'Volte à posição inicial com controle (use ajuda se não completar).',
  ]),
  c('oblique_crunches', 'Abdominal oblíquo com pés elevados', ['core'], [BANCO], 'Leve o cotovelo ao joelho oposto girando o tronco.', [
    'Deitado com a lombar no chão e os pés apoiados numa superfície elevada.',
    'Uma mão ao lado da cabeça e a outra no chão.',
    'Eleve o ombro e o tronco até o cotovelo tocar o joelho oposto.',
    'Desça e, ao fim da série, troque de lado.',
  ]),
  c('oblique_crunches_on_the_floor', 'Abdominal oblíquo deitado de lado', ['core'], [PC], 'Suba o mais alto que puder e segure 1 s.', [
    'Deite sobre o lado direito com as pernas sobrepostas e joelhos levemente flexionados.',
    'Mão esquerda atrás da cabeça.',
    'Eleve o cotovelo esquerdo como num abdominal, com ênfase no oblíquo, expirando.',
    'Segure 1 s, desça devagar e depois troque de lado.',
  ]),
  c('one_arm_chin_up', 'Barra a um braço (com toalha de apoio)', ['back', 'biceps'], [BARRA], 'Use a mão na toalha só como auxílio; progrida reduzindo a ajuda.', [
    'Passe uma toalha pela barra; uma mão segura a barra (palma para você) e a outra a toalha.',
    'Incline o tronco ~30° para trás com o peito aberto.',
    'Puxe até a barra tocar a parte alta do peito, levando ombros e braços para baixo e para trás, expirando.',
    'Segure 1 s e desça devagar. Troque de braço.',
  ]),
  c('parallel_bar_dip', 'Mergulho nas paralelas', ['triceps', 'chest'], [PARALELAS], 'Desça até os braços passarem de 90°, sem balançar.', [
    'Entre as paralelas, apoie uma mão em cada barra e dê um pequeno impulso até travar os braços.',
    'Flexione os cotovelos e desça até os braços passarem de 90°, com boa postura.',
    'Estenda os cotovelos voltando à posição inicial.',
  ]),
  c('plank', 'Prancha (Plank)', ['core'], [PC], 'Corpo em linha reta: nem quadril alto, nem lombar afundando.', [
    'De bruços, apoie-se nos antebraços (cotovelos sob os ombros) e nas pontas dos pés.',
    'Mantenha o corpo reto, abdômen e glúteos contraídos, pelo maior tempo possível.',
    'Para dificultar, eleve um braço ou uma perna.',
  ], true),
  c('plyo_push_up', 'Flexão pliométrica', ['chest', 'plyo'], [PC], 'Empurre tão rápido que as mãos saiam do chão; adicione palmas para dificultar.', [
    'Em posição de flexão, braços estendidos na largura dos ombros e corpo reto.',
    'Desça flexionando os cotovelos até o peito se aproximar do chão.',
    'Empurre explosivamente até as mãos saírem do chão.',
    'Aterrisse com os cotovelos levemente flexionados e repita.',
  ]),
  c('pullups', 'Barra fixa pronada (Pull-Up)', ['back'], [BARRA], 'Leve ombros e braços para baixo e para trás; sem balanço.', [
    'Segure a barra com as palmas para frente (pegada fechada, média ou aberta).',
    'Braços estendidos, tronco inclinado ~30° para trás e peito aberto.',
    'Puxe até a barra tocar a parte alta do peito, levando ombros e braços para baixo e para trás, expirando.',
    'Segure 1 s e desça devagar inspirando.',
  ]),
  c('push_up_wide', 'Flexão aberta', ['chest'], [PC], 'Não deixe o quadril cair; ênfase no peitoral.', [
    'Em prancha alta com as mãos bem afastadas, cotovelos estendidos e corpo reto.',
    'Flexione os cotovelos e desça o peito ao chão, inspirando.',
    'Empurre usando o peitoral até estender os braços, expirando.',
  ]),
  c('push_ups_close_triceps_position', 'Flexão fechada (diamante)', ['triceps', 'chest'], [PC], 'Mãos mais fechadas que os ombros e cotovelos rente ao corpo.', [
    'De bruços, mãos mais fechadas que a largura dos ombros e braços estendidos.',
    'Desça até o peito quase tocar o chão, inspirando.',
    'Empurre usando o tríceps até estender os braços, expirando; pausa de 1 s.',
  ]),
  c('push_ups_with_feet_elevated', 'Flexão com pés elevados', ['chest'], [BANCO], 'Quanto mais alto o banco, maior a resistência.', [
    'Mãos no chão afastadas ~90 cm e pontas dos pés sobre um banco.',
    'Desça até o peito quase tocar o chão, inspirando.',
    'Empurre usando o peitoral e contraia no topo, expirando; pausa de 1 s.',
  ]),
  c('push_up_to_side_plank', 'Flexão com prancha lateral', ['chest', 'core'], [PC], 'Gire o corpo inteiro em bloco ao abrir o braço para o teto.', [
    'Em posição de flexão, mãos um pouco mais abertas que os ombros.',
    'Faça uma flexão mantendo o corpo reto.',
    'Ao subir, transfira o peso para um lado e gire elevando o outro braço para o teto (prancha lateral).',
    'Volte, faça outra flexão e gire para o outro lado. Alterne.',
  ]),
  c('pushups', 'Flexão de braço (Push-Up)', ['chest'], [PC], 'Corpo em prancha, cotovelos a ~45° do tronco.', [
    'De bruços, mãos afastadas ~90 cm e tronco elevado com os braços estendidos.',
    'Desça até o peito quase tocar o chão, inspirando.',
    'Empurre de volta contraindo o peito, expirando; pausa breve no topo.',
  ]),
  c('pushups_close_and_wide_hand_positions', 'Flexão variando pegada (fechada e aberta)', ['chest', 'triceps'], [PC], 'Alterne a largura das mãos entre as séries para variar o estímulo.', [
    'Em prancha alta com as mãos abertas (mais que os ombros) ou fechadas (menos que os ombros).',
    'Desça até o peito quase tocar o chão, inspirando.',
    'Empurre contraindo o peito, expirando; pausa de 1 s no topo.',
  ]),
  c('quick_leap', 'Salto rápido da caixa (Quick Leap)', ['plyo', 'legs'], [CAIXA], 'Pés chapados e pernas flexionadas ao aterrissar na caixa.', [
    'Fique de frente para a caixa a 30–60 cm da borda.',
    'Salte para cima da caixa usando o quadril, aterrissando com os dois pés.',
    'Imediatamente estenda todo o corpo, balance os braços acima da cabeça e salte da caixa.',
    'Amorteça a aterrissagem com as pernas.',
  ]),
  c('reverse_crunch', 'Abdominal reverso', ['core'], [PC], 'Braços parados; enrole a pelve trazendo os joelhos ao peito.', [
    'Deitado, braços ao lado do tronco com as palmas no chão.',
    'Coxas perpendiculares ao chão e pés juntos.',
    'Traga as pernas em direção ao tronco enrolando a pelve e tirando o quadril do chão.',
    'Segure 1 s e volte devagar.',
  ]),
  c('ring_dips', 'Mergulho nas argolas', ['triceps', 'chest'], [ARGOLAS], 'Argolas junto ao corpo para estabilizar; sem balanço.', [
    'Segure uma argola em cada mão e dê um pequeno impulso até travar os braços.',
    'Flexione os cotovelos e desça até os braços passarem de 90°, com boa postura.',
    'Estenda os cotovelos voltando ao topo.',
  ]),
  c('rocket_jump', 'Salto foguete (Rocket Jump)', ['plyo', 'legs'], [PC], 'Estenda o corpo inteiro e alcance o mais alto que puder.', [
    'Em pé, pés na largura dos ombros e braços junto ao corpo.',
    'Agache até a metade e exploda para cima o mais alto possível.',
    'Estenda todo o corpo levando os braços acima da cabeça.',
    'Aterrisse amortecendo com as pernas.',
  ]),
  c('rocky_pull_ups_pulldowns', 'Barra "Rocky" (frente e nuca)', ['back'], [BARRA], 'Alterne uma repetição à frente e outra atrás da nuca.', [
    'Pegada pronada aberta, tronco inclinado ~30° para trás e peito aberto.',
    'Puxe até a barra tocar a parte alta do peito; segure 1 s e desça devagar.',
    'Na próxima repetição, puxe com o tronco ereto até a barra passar atrás da nuca.',
    'Alterne as duas formas até completar a série.',
  ]),
  c('rope_climb', 'Subida na corda', ['back', 'biceps'], [CORDA], 'Use os pés para "travar" a corda e poupar os braços.', [
    'Segure a corda acima da cabeça e dê um pequeno salto puxando-a.',
    'Enrole a corda em uma perna e prenda-a entre os pés; estenda os braços o mais alto possível.',
    'Solte os pés e puxe com os braços trazendo os joelhos ao peito; prenda os pés de novo e fique em pé.',
    'Repita até o topo e desça mão sobre mão, afrouxando os pés.',
  ]),
  c('russian_twist', 'Rotação russa (Russian Twist)', ['core'], [PC], 'Gire o tronco, não só os braços; segure 1 s de cada lado.', [
    'Sentado com os joelhos flexionados e os pés presos (ou suspensos para dificultar).',
    'Incline o tronco formando um "V" com as coxas, braços estendidos à frente com as mãos unidas.',
    'Gire o tronco para a direita até os braços ficarem paralelos ao chão, expirando.',
    'Volte ao centro e gire para a esquerda. Alterne.',
  ]),
  c('scapular_pull_up', 'Barra escapular (Scapular Pull-Up)', ['back', 'shoulders'], [BARRA], 'Braços estendidos: o movimento é só das escápulas descendo.', [
    'Segure a barra com pegada pronada, suspenso.',
    'Sem dobrar os cotovelos, eleve o corpo alguns centímetros deprimindo as escápulas (encolhimento invertido).',
    'Pausa no topo e desça devagar.',
  ]),
  c('scissors_jump', 'Salto tesoura (afundo com salto)', ['plyo', 'legs'], [PC], 'Joelho da frente alinhado ao pé na aterrissagem.', [
    'Em posição de afundo: pé da frente com joelho flexionado e joelho de trás quase no chão.',
    'Salte o mais alto possível estendendo as pernas e balançando os braços.',
    'No ar, troque as pernas: a da frente vai para trás e vice-versa.',
    'Aterrisse em afundo amortecendo e repita.',
  ]),
  c('seated_flat_bench_leg_pull_in', 'Recolhimento sentado no banco', ['core'], [BANCO], 'Aproxime tronco e joelhos ao mesmo tempo.', [
    'Sentado no banco, pernas estendidas à frente levemente abaixo da linha do banco e mãos nas laterais.',
    'Tronco inclinado ~45° para trás.',
    'Traga os joelhos em sua direção enquanto aproxima o tronco deles, expirando.',
    'Pausa de 1 s e volte inspirando.',
  ]),
  c('seated_leg_tucks', 'Encolhimento de pernas sentado no chão', ['core'], [PC], 'Equilibre-se nos glúteos e mantenha o abdômen firme.', [
    'Sentado, pernas estendidas à frente pouco acima do chão e mãos apoiadas ao lado do quadril.',
    'Tronco inclinado ~45° para trás.',
    'Traga os joelhos ao peito aproximando o tronco deles, expirando.',
    'Pausa de 1 s e estenda de volta.',
  ]),
  c('side_bridge', 'Prancha lateral (Side Bridge)', ['core'], [PC], 'Quadril alto e corpo em linha reta da cabeça aos pés.', [
    'Deite de lado apoiado no antebraço, cotovelo sob o ombro e pernas estendidas sobrepostas.',
    'Eleve o quadril do chão até o corpo formar uma linha reta.',
    'Sustente pelo tempo indicado e troque de lado.',
  ], true),
  c('side_jackknife', 'Canivete lateral (Side Jackknife)', ['core'], [PC], 'Aproxime cotovelo e perna pela lateral, contraindo o oblíquo.', [
    'Deite de lado, pernas estendidas sobrepostas, mão de cima atrás da cabeça e braço de baixo apoiado no chão.',
    'Eleve ao mesmo tempo o tronco e a perna de cima, aproximando o cotovelo do joelho.',
    'Desça devagar e, ao fim da série, troque de lado.',
  ]),
  c('side_standing_long_jump', 'Salto lateral parado', ['plyo', 'legs'], [PC], 'Lidere o movimento com os braços e aterrisse com os pés afastados.', [
    'Em postura atlética, pés afastados na largura do quadril, joelhos e quadril levemente flexionados.',
    'Incline para a direita e salte o mais longe possível para o lado, estendendo quadril, joelhos e tornozelos.',
    'Aterrisse de frente para a mesma direção, amortecendo com as pernas.',
  ]),
  c('side_to_side_chins', 'Barra alternando os lados', ['back'], [BARRA], 'Leve o peito em direção a uma das mãos a cada repetição.', [
    'Pegada pronada aberta, tronco inclinado ~30° para trás e peito aberto.',
    'Puxe inclinando para a esquerda até a barra quase tocar a parte alta do peito, expirando.',
    'Segure 1 s, desça e repita inclinando para a direita.',
  ]),
  c('side_to_side_box_shuffle', 'Troca lateral sobre a caixa', ['plyo', 'legs'], [CAIXA], 'Use os braços para ritmo e mantenha os saltos contínuos.', [
    'De lado para a caixa, apoie o pé esquerdo no meio dela.',
    'Salte para o outro lado: pé direito na caixa e esquerdo no chão.',
    'Continue alternando de um lado para o outro balançando os braços.',
  ]),
  c('single_arm_push_up', 'Flexão com um braço', ['chest', 'triceps'], [PC], 'Afaste bem os pés para ter base; desça devagar.', [
    'Apoiado nas pontas dos pés e em um braço estendido sob o ombro; pés mais afastados que numa flexão normal.',
    'Mão livre atrás das costas e postura firme.',
    'Flexione o cotovelo e desça devagar até tocar o chão.',
    'Estenda o braço voltando à posição inicial. Troque de braço.',
  ]),
  c('single_leg_high_box_squat', 'Subida unilateral na caixa alta', ['legs'], [CAIXA], 'Suba usando a perna de apoio, sem impulso da perna de baixo.', [
    'Coloque uma caixa alta e, se precisar, uma corda/elástico acima para equilíbrio.',
    'Suba na caixa com uma perna até ficar totalmente em pé, deixando a outra solta.',
    'Desça e suba com a mesma perna até completar a série; depois troque.',
  ]),
];

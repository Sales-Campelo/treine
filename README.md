# Treine

App de treinos que une **Musculação**, **Artes Marciais** e **Calistenia**: uma plataforma comum (calendário, catálogo anatômico, mapa de fadiga, biometria) e um **Workout Player** que muda de motor conforme a modalidade.

- Arquitetura, schema SQL, máquina de estados do timer, algoritmo de fadiga e backlog: [docs/ARQUITETURA.md](docs/ARQUITETURA.md)
- Schema Supabase: [supabase/migrations/0001_init.sql](supabase/migrations/0001_init.sql)
- Referência visual: [desing/](desing/) (design system *Kinetic Amber*)

## Rodar

```bash
npm install
npx expo start        # i = iOS, a = Android, w = web
npm test              # FSM do timer + algoritmo de fadiga
npx tsc --noEmit
```

Os dados ficam salvos offline no dispositivo. No primeiro uso o app gera ~5 semanas de histórico de demonstração, que pode ser restaurado em Perfil.

TTS, sons em segundo plano, vibração e notificações de fim de descanso precisam de um aparelho real (Expo Go ou `npx expo run:android|ios`). No navegador eles funcionam apenas em parte.

Para regenerar os sons do timer: `node scripts/gen-sounds.js`.

## Catálogo de exercícios

- **Musculação:** 150 exercícios em máquinas, Smith e polias (`src/core/catalog/strength.ts`).
- **Calistenia:** 150 exercícios de peso corporal com animação e passo a passo em português. Para regerar as imagens: `npm run catalog:media`.
- **Seed do Supabase:** `npm run catalog:sql` gera `supabase/seed/catalog.sql`.

### Créditos

As imagens e instruções originais dos exercícios de calistenia vêm do [free-exercise-db](https://github.com/yuhonas/free-exercise-db), liberado em domínio público (Unlicense, ver `assets/exercises/cali/LICENSE.txt`). Os textos foram traduzidos e adaptados para o português.

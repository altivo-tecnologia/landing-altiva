# Qualidade de código e mini design system

Execute `pnpm run quality` antes de entregar uma alteração e `pnpm run build` para validar a geração estática. O CI executa ambos, audita dependências e procura segredos; uma falha impede a conclusão do gate. Push na main e pull requests não publicam o site. A publicação exige execução manual do workflow com deploy habilitado, na main.

## Tokens

`src/styles/tokens.css` é a fonte única dos valores de cores, fontes, raios e sombra de marca. O `@theme` do Tailwind disponibiliza esses valores como classes e variáveis CSS, sem duplicar uma paleta em TypeScript.

- `canvas` e `surface`: fundo escuro e superfície clara.
- `ink`, `copy`, `copy-strong`, `copy-muted`: textos sobre superfície clara.
- `on-canvas`, `on-canvas-copy`, `on-canvas-muted`: textos sobre fundo escuro.
- `line`, `line-dark`, `line-inverse` e variações: divisórias e bordas.
- `primary`, `primary-hover`, `primary-soft`, `brand-detail`: destaques da marca.
- `overlay-*` e `mask`: camadas e máscaras.

Use `bg-canvas`, `text-copy`, `hover:text-primary`, `border-line` e modificadores como `bg-canvas/90`. Em CSS, use `var(--color-canvas)` ou `var(--font-display)`. Valores arbitrários de layout, como `grid-cols-[20rem_1fr]`, continuam permitidos.

O gate bloqueia cores literais em código de `src`, famílias de cores padrão do Tailwind, variáveis de tokens inexistentes e nomes inexistentes nas famílias semânticas. Valores de cor novos devem ser definidos no arquivo de tokens, com um nome que explique seu papel. Conteúdo Markdown e assets não fazem parte dessa análise de código.

## Reutilização

Lógica compartilhada deve ficar em `src/utils`; markup e comportamento visual compartilhados devem ficar em `src/components/shared` ou no diretório do domínio. Não transforme markup em strings de HTML dentro de utils. Constantes de negócio ficam no módulo que as utiliza ou compartilha; tokens visuais ficam no CSS de tema.

O gate de duplicação bloqueia blocos idênticos com oito linhas significativas consecutivas e pelo menos 240 caracteres, inclusive dentro do mesmo arquivo. Ignora imports, comentários e linhas vazias, e normaliza espaços. Analisa Astro, CSS, TS e JS em `src`, sem baseline ou lista de exceções.

Esse detector encontra cópias textuais; não prova ausência de duplicação semântica nem detecta todas as cópias curtas ou reescritas. Em revisão, extraia também regras repetidas abaixo desse limite quando representarem a mesma responsabilidade. Evite abstrações para frases ou estruturas curtas que apenas se parecem.

## Comandos

- `pnpm run audit:dependencies`: vulnerabilidades conhecidas, incluindo dependências de desenvolvimento; qualquer severidade bloqueia o CI.
- `pnpm run check:secrets`: scanner Secretlint nos arquivos não ignorados pelo Git.

- `pnpm run lint`: regras ESLint para Astro e TypeScript, sem warnings.
- `pnpm run check:design`: paleta e uso de tokens.
- `pnpm run check:duplicates`: blocos de código repetidos.
- `pnpm run test:quality`: testes dos detectores, com exemplos válidos e inválidos.
- `pnpm run check:size`: até 300 linhas por módulo e 500 por stylesheet.
- `pnpm run format:check`: formatação Prettier com suporte a Astro.
- `pnpm run check:types`: verificação do Astro.
- `pnpm run quality`: todos os checks acima.

Não desative o gate para acomodar uma ocorrência: cor solta vira token; lógica repetida vira util; interface repetida vira componente. Os testes dos detectores devem acompanhar mudanças nas regras.

## Antes do commit e proteção da main

Execute `pnpm install --frozen-lockfile`, `pnpm audit:dependencies`, `pnpm check:secrets`, `pnpm quality` e `pnpm build`. Confira o conteúdo staged: inclua o lockfile e os novos arquivos, atualize as alterações e registre as remoções.

No GitHub, configure uma regra para exigir pull request e o status `Quality and build` antes de merge na main. Essa proteção depende da configuração do repositório e não é aplicada apenas pelo YAML. O primeiro push ainda é necessário para comprovar a execução no runner.

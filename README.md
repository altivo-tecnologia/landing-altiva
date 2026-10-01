# Altivo Tecnologia

Este repositório reúne o site e os relatos públicos da Altivo Tecnologia. Compartilhamos projetos, aprendizados e ideias sobre como a tecnologia pode tornar a rotina de pequenas e médias empresas mais simples.

Conheça a Altivo em [altivo.net.br](https://altivo.net.br).

## Desenvolvimento

Use Node.js 22.12 ou superior e pnpm 10.27.0, fixado em `packageManager`.

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm quality
pnpm build
pnpm audit:dependencies
```

Versione `pnpm-lock.yaml`. O CI usa instalação com lockfile congelado. Scripts de instalação de dependências ficam bloqueados; novas resoluções respeitam uma espera de sete dias após a publicação.

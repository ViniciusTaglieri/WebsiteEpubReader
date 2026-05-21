# Website — Leitor EPUB

Landing page do [Leitor EPUB](https://github.com/ViniciusTaglieri/EpubReader), um leitor de livros desktop para Windows com biblioteca local, coleções, temas e leitura offline.

**Site:** https://viniciustaglieri.github.io/WebsiteEpubReader

---

## Stack

- [Astro 5](https://astro.build) — framework de geração estática
- [React 19](https://react.dev) — componente interativo da demo do leitor
- [Tailwind CSS 3](https://tailwindcss.com) — estilização
- [Framer Motion](https://www.framer.com/motion/) — animação da demo
- [Radix UI](https://www.radix-ui.com) — slider, select e toggle acessíveis
- [Lucide React](https://lucide.dev) — ícones

## Rodando localmente

```bash
pnpm install
pnpm dev
```

O servidor sobe em `http://127.0.0.1:4321`.

## Build

```bash
pnpm build
```

A saída fica em `dist/` — arquivos HTML/CSS/JS estáticos prontos para deploy.

## Deploy

O deploy é automático via GitHub Actions (`.github/workflows/pages.yml`): a cada push na branch `main`, o site é buildado e publicado no GitHub Pages.

## Estrutura

```
src/
├── pages/
│   └── index.astro          # única página, com SEO e structured data
├── components/
│   ├── Header.astro          # navegação desktop + menu mobile
│   ├── Hero.astro            # seção principal com CTAs
│   ├── ReaderDemo.tsx        # demo interativa das configurações de leitura
│   ├── FeatureStrip.astro    # faixa de funcionalidades
│   ├── Colecoes.astro        # seção de coleções
│   ├── Footer.astro          # rodapé com CTAs de download
│   └── GitHubMark.astro      # ícone do GitHub (SVG inline)
├── lib/
│   └── readerPreview.ts      # lógica de estado da demo do leitor
└── styles.css                # variáveis CSS e estilos globais
public/
├── images/
│   └── hero.png              # screenshot do app
├── favicon.svg
└── .nojekyll                 # necessário para GitHub Pages servir _astro/
```

---
name: bia-conteudo
description: Use ao adicionar ou alterar conteúdo no site do BIA (bia-unipampa.github.io): nova página, nova seção, novo vídeo, música, jogo, clipe ou cartão, ou mudança no menu. Garante o estilo visual do site, atualiza as páginas relacionadas, o menu, o rodapé, os cartões da página inicial e as traduções, e verifica links.
---

# Adicionar conteúdo ao site do BIA

Site estático (HTML, CSS e JavaScript puros, sem build), publicado no GitHub Pages. Toda mudança deve manter o estilo existente e deixar o site consistente: menu, rodapé, cartões, traduções e links.

## 1. Antes de editar

1. Identifique onde o conteúdo entra (tabela abaixo) e leia a página-alvo e uma página irmã do mesmo tipo, para copiar a estrutura em vez de inventar.
2. Rode o verificador para saber o estado atual (problemas preexistentes não devem ser confundidos com os seus):
   `python3 -I .claude/skills/bia-conteudo/scripts/verifica-site.py .`
3. Se não estiver claro se o conteúdo merece página própria ou só uma seção numa página existente, pergunte ao usuário.

| Tipo de conteúdo | Onde fica | Identidade visual |
|---|---|---|
| Página institucional do curso | raiz (`mercado.html`, `inovacao.html` etc.) | site principal |
| Músicas, vídeos e outros exemplos feitos com IA | `feito-com-ia/` | site principal |
| Material para escolas (clipes, jogos, oficinas) | `escolas/` | identidade própria das Escolas |
| Especialização EIA | `eia/` (central: `eia/index.html`) | identidade própria da EIA |
| Jogos avulsos | `jogo/` | própria de cada jogo |

## 2. Estilo do site principal

Copie de uma página interna existente (ex.: `mercado.html`) o `<head>`, o `<header class="nav">`, o `<footer class="footer">` e os scripts finais. Elementos obrigatórios:

- `<meta charset="UTF-8" />` como primeira linha do `<head>`; `lang="pt"`; `title` no formato `Assunto · BIA · UNIPAMPA`; `description`, Open Graph e `theme-color #06070d`.
- Fontes Google: Bricolage Grotesque (títulos), Manrope (texto), JetBrains Mono (técnico). Não introduza outras.
- `assets/css/styles.css` e `assets/css/pages.css`; no fim do `body`, `assets/js/neural.js` e `assets/js/site.js`. O fundo `<canvas id="neural">` e `<div class="grain">` vêm logo após `<body>`.
- Script do Umami (analytics) idêntico ao das outras páginas.
- Em subpastas, todos os caminhos ganham `../` (CSS, JS, imagens, menu, rodapé).
- Cabeçalho da página com `section.phero` (`phero__crumb`, `phero__title` com `<em>` no destaque, `phero__lead`). Conteúdo em `section.section` > `div.wrap`.
- Reutilize os componentes de `pages.css` (`grid grid--N`, `tile`, `bignum`, `callout`, `note`, `chips`, `faq`, `steps`, `timeline`, `dtable`, `bars`) e as classes `reveal`, `kicker`, `section__title`, `section__lead` de `styles.css`. Antes de criar CSS novo, procure um componente equivalente; se precisar criar, coloque em `pages.css`, usando as variáveis de cor existentes, nunca cores fixas soltas.
- Páginas internas são só em português. Apenas `index.html` é trilíngue.

Páginas de `escolas/` e `eia/` têm identidade visual própria: siga a página irmã da mesma pasta, não o site principal.

## 3. Texto

- Português impecável (acentos, concordância, pontuação). Nunca use travessão (em dash): use vírgula, dois-pontos, parênteses ou ponto.
- Cite a fonte de todo número ou estatística (padrão `bignum__src`).
- Tom: entusiasmado e direto, voltado a futuros alunos; sem jargão sem explicação.

## 4. Atualizar o que se relaciona (checklist obrigatório)

Para **página nova no menu principal**, atualize todos os itens abaixo:

1. **Menu** (`nav.nav__links`) em todas as páginas que o têm. Liste-as com `grep -rl 'class="nav__links"' . --include='*.html'`. Mesma ordem em todas; `aria-current="page"` só na própria página; caminhos com `../` em subpastas.
2. **`index.html`**: no menu use `data-i18n="nav.<chave>"`, não texto fixo.
3. **`assets/js/i18n.js`**: adicione `nav.<chave>`, `explore.cN.t` e `explore.cN.d` nos **três** idiomas (PT, ES, EN). Em ES e EN, se o conteúdo da página for só em português, indique isso na descrição, como nos cartões existentes.
4. **Cartão** na seção `#explore` de `index.html` (`a.explore__card` com ícone, título, descrição e `explore__go`).
5. **Rodapé "Explore"** de todas as páginas do site principal, com os mesmos destinos do menu (sem "Início"), na mesma ordem.
6. **Largura do menu**: cada item novo encurta o espaço. O menu vira hambúrguer abaixo de 1340px (`assets/css/styles.css`, `@media (max-width: 1340px)` e o ajuste de 1341px a 1560px). Confira que o menu cabe numa linha a 1341px; se não couber, ajuste esses breakpoints e avise o usuário.
7. **README.md**: acrescente a página na seção "Estrutura".

Para **conteúdo dentro de uma seção existente** (vídeo, música, jogo, clipe):

- Adicione na página-índice da seção (`escolas/index.html`, `feito-com-ia/index.html`, `eia/index.html`), seguindo o formato dos itens vizinhos.
- Se a página-índice mostra contagens ou resumos ("seis vídeos", "18 músicas"), atualize os números no texto, na descrição do cartão em `i18n.js` (três idiomas) e na `meta description`.
- Clipes e vídeos: página própria com poster e legendas, como os clipes existentes em `escolas/`.
- Nova versão de proposta EIA: arquivo `eia/proposta-eia-vN.html` e atualização de `eia/index.html`.

Ao **mover ou renomear** páginas: atualize todos os links internos (`grep -rn 'nome-antigo' --include='*.html' --include='*.js' .`). Não crie páginas de redirecionamento.

## 5. Verificação final

1. Rode `python3 -I .claude/skills/bia-conteudo/scripts/verifica-site.py .` e resolva todo problema introduzido pela mudança. O script confere menu igual em todas as páginas, rodapé "Explore" coerente com o menu, cartões do `index.html` e links locais quebrados.
2. Rode a skill `web-qualidade` nos arquivos alterados: `bash ~/.claude/skills/web-qualidade/scripts/verifica-web.sh --lighthouse <pagina.html> <arquivos>`. Corrija o que a mudança introduziu e relate os problemas preexistentes.
3. Sirva o site (`python3 -m http.server 8080`) e, se houver navegador headless disponível, confira a página nova em 1440px, 1341px e 390px de largura (sem rolagem horizontal, menu numa linha acima de 1340px) e sem erros no console. Se não for possível testar no navegador, diga isso explicitamente.
4. Na página inicial, troque o idioma para ES e EN e confira se as novas chaves aparecem (chave sem tradução aparece vazia).

## 6. Ao terminar

- Não faça commit nem push: deixe as alterações na árvore de trabalho e liste os arquivos alterados.
- Informe o que não foi verificado (ex.: teste em celular real) e qualquer problema preexistente apontado pelo verificador que não foi corrigido.

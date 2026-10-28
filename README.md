# BIA · Bacharelado em Inteligência Artificial — UNIPAMPA

Site oficial do **Bacharelado em Inteligência Artificial (BIA)** da Universidade
Federal do Pampa (UNIPAMPA), Campus Alegrete-RS — *o curso de IA mais disruptivo
do Brasil*.

🔗 **https://bia-unipampa.github.io**

## Sobre

Site estático (HTML + CSS + JavaScript vanilla, **sem build step**), publicado via
GitHub Pages. Trilíngue (PT / ES / EN), com estética neural / cyber-futurista e
matriz curricular interativa baseada no PPC (v1.4, 2026).

## Estrutura

```
index.html                 Página inicial (trilíngue PT/ES/EN)
matriz.html                Matriz passo a passo (explorador por semestre e por eixo)
grade.html                 Monte sua grade (planejador salvo no navegador)
mercado.html               Mercado de IA: dados e estatísticas
inovacao.html              Inovação e criação de empresas com IA
por-que-bia.html           Por que o BIA é único
alegrete.html              Por que estudar em Alegrete / UNIPAMPA
assets/css/styles.css       Estilos base
assets/css/pages.css        Componentes das páginas internas
assets/js/curriculum.js     Dados da matriz (8 semestres + eletivas com CH e semestre mínimo)
assets/js/i18n.js           Traduções PT/ES/EN (página inicial)
assets/js/app.js            i18n, render, modal e interações da página inicial
assets/js/neural.js         Fundo animado de rede neural (todas as páginas)
assets/js/site.js           Nav, revelação e tooltip das páginas internas
assets/js/matriz-guia.js    Lógica da página da matriz
assets/js/grade.js          Lógica do planejador de grade
assets/img/                 Favicon e OG image
```

As páginas internas estão, por ora, apenas em português.

## Desenvolvimento

Como é estático, basta servir a pasta:

```bash
python3 -m http.server 8080
# abra http://localhost:8080
```

## Créditos

Coordenado e impulsionado pelo [AI Horizon Labs](https://ai-horizon-labs.github.io).

© 2026 AI Horizon Labs · UNIPAMPA. Todos os direitos reservados.

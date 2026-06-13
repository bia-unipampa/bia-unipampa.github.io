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
index.html                 Página única
assets/css/styles.css       Estilos
assets/js/curriculum.js     Dados da matriz (8 semestres + trilhas eletivas)
assets/js/i18n.js           Traduções PT/ES/EN
assets/js/app.js            Rede neural animada, i18n, render, modal, interações
assets/img/                 Favicon e OG image
```

## Desenvolvimento

Como é estático, basta servir a pasta:

```bash
python3 -m http.server 8080
# abra http://localhost:8080
```

## Créditos

Coordenado e impulsionado pelo [AI Horizon Labs](https://ai-horizon-labs.github.io).

© 2026 AI Horizon Labs · UNIPAMPA. Todos os direitos reservados.

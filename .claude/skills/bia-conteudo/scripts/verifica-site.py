#!/usr/bin/env python3
"""Verifica a consistência do site BIA.

1. Menu principal (nav.nav__links) igual em todas as páginas que o têm.
2. Coluna "Explore" do rodapé com os mesmos destinos do menu (menos Início).
3. Cartões "explore" do index.html cobrindo as páginas do menu.
4. Links locais (href/src) apontando para arquivos que existem.

Uso: python3 -I verifica-site.py [raiz-do-site]
Sai com código 1 se encontrar problemas.
"""

from __future__ import annotations

import os
import posixpath
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlparse

IGNORA_DIRS = {".git", "node_modules", ".claude", "files"}
PREFIXOS_EXTERNOS = ("#", "mailto:", "tel:", "data:", "javascript:")
INDEX = "index.html"
STATS = "stats.html"


def contexto_da_tag(tag: str, attrs: dict[str, str | None]) -> str | None:
    """Indica qual região do menu ou do rodapé a tag abre, se alguma.

    Args:
        tag: Nome da tag HTML.
        attrs: Atributos da tag.

    Returns:
        "nav", "footer", "cards" ou None.
    """
    classes = (attrs.get("class") or "").split()
    if tag == "nav" and "nav__links" in classes:
        return "nav"
    if tag == "nav" and attrs.get("aria-label") == "Explore":
        return "footer"
    if tag == "div" and "explore" in classes:
        return "cards"
    return None


class Coletor(HTMLParser):  # pylint: disable=abstract-method
    """Coleta links e os itens de menu, rodapé e cartões de uma página."""

    def __init__(self) -> None:
        """Inicializa as listas coletadas e a pilha de contexto."""
        super().__init__()
        self.links: list[str] = []
        self.nav: list[str] = []
        self.explore_footer: list[str] = []
        self.explore_cards: list[str] = []
        self._pilha: list[str | None] = []

    def _contexto_atual(self) -> str | None:
        return next((c for c in reversed(self._pilha) if c), None)

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        """Registra links e atualiza a pilha de contexto."""
        a = dict(attrs)
        if tag in ("nav", "div"):
            self._pilha.append(contexto_da_tag(tag, a))
        self.links.extend(v for k in ("href", "src") if (v := a.get(k)))
        href = a.get("href")
        if tag == "a" and href:
            self._registra_link(href, (a.get("class") or "").split())

    def _registra_link(self, href: str, classes: list[str]) -> None:
        destinos = {
            "nav": self.nav,
            "footer": self.explore_footer,
            "cards": self.explore_cards,
        }
        ctx = self._contexto_atual()
        if ctx == "cards" and "explore__card" not in classes:
            return
        if ctx in destinos:
            destinos[ctx].append(href)

    def handle_endtag(self, tag: str) -> None:
        """Fecha o contexto aberto por nav ou div."""
        if tag in ("nav", "div") and self._pilha:
            self._pilha.pop()


def normaliza(href: str, pagina: str) -> str:
    """Converte um href relativo à página em caminho relativo à raiz do site."""
    base = posixpath.dirname(pagina)
    return posixpath.normpath(posixpath.join(base, unquote(urlparse(href).path)))


def paginas(raiz: Path) -> list[str]:
    """Lista as páginas HTML do site, relativas à raiz, ignorando pastas internas."""
    encontradas = []
    for d, dirs, arqs in os.walk(raiz):
        dirs[:] = [x for x in dirs if x not in IGNORA_DIRS]
        encontradas += [
            (Path(d) / a).relative_to(raiz).as_posix()
            for a in arqs
            if a.endswith(".html")
        ]
    return sorted(encontradas)


def links_quebrados(raiz: Path, pagina: str, coletor: Coletor) -> list[str]:
    """Retorna os links locais da página que apontam para arquivos inexistentes."""
    problemas = []
    for href in coletor.links:
        u = urlparse(href)
        if u.scheme or href.startswith(PREFIXOS_EXTERNOS) or not u.path:
            continue
        if not (raiz / normaliza(href, pagina)).exists():
            problemas.append(f"Link quebrado em {pagina}: {href}")
    return problemas


def menu_da_pagina(pagina: str, coletor: Coletor) -> list[str]:
    """Retorna os destinos do menu da página, normalizados (âncora vira index)."""
    return [INDEX if h.startswith("#") else normaliza(h, pagina) for h in coletor.nav]


def problema_de_rodape(pagina: str, coletor: Coletor, esperado: list[str]) -> str:
    """Compara o rodapé "Explore" da página com os destinos esperados.

    Returns:
        A descrição do problema, ou texto vazio se o rodapé estiver correto.
    """
    rodape = [normaliza(h, pagina) for h in coletor.explore_footer]
    if pagina == STATS or rodape == esperado:
        return ""
    faltam = ", ".join(x for x in esperado if x not in rodape) or "nada"
    sobram = ", ".join(x for x in rodape if x not in esperado) or "nada"
    return (
        f"Rodapé 'Explore' diferente do menu em {pagina}; "
        f"faltam: {faltam}; sobram: {sobram}"
    )


def problemas_de_menu(dados: dict[str, Coletor], ref: list[str]) -> list[str]:
    """Compara o menu e o rodapé de cada página com o menu de referência."""
    problemas = []
    for p, c in dados.items():
        if not c.nav:
            continue
        menu = menu_da_pagina(p, c)
        if menu != ref:
            problemas.append(f"Menu diferente em {p}: {' | '.join(menu)}")
        problemas.append(problema_de_rodape(p, c, ref[1:]))
    return [x for x in problemas if x]


def main() -> int:
    """Executa todas as verificações e imprime o relatório.

    Returns:
        0 se não houver problemas, 1 caso contrário.
    """
    raiz = Path(sys.argv[1] if len(sys.argv) > 1 else ".").resolve()
    dados: dict[str, Coletor] = {}
    problemas: list[str] = []
    for p in paginas(raiz):
        c = Coletor()
        c.feed((raiz / p).read_text(encoding="utf-8"))
        dados[p] = c
        problemas += links_quebrados(raiz, p, c)

    ref = menu_da_pagina(INDEX, dados[INDEX])
    print("Menu de referência (index.html):", " | ".join(ref))
    problemas += problemas_de_menu(dados, ref)
    cards = [normaliza(h, INDEX) for h in dados[INDEX].explore_cards]
    problemas += [
        f"index.html: sem cartão na seção 'explore' para {x}"
        for x in ref[1:]
        if x not in cards
    ]

    com_menu = sum(1 for c in dados.values() if c.nav)
    print(f"Páginas analisadas: {len(dados)} ({com_menu} com o menu principal)")
    if not problemas:
        print("Nenhum problema encontrado.")
        return 0
    print(f"\n{len(problemas)} problema(s):")
    for x in problemas:
        print(" -", x)
    return 1


if __name__ == "__main__":
    raise SystemExit(main())

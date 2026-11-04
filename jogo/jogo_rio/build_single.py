# Gera uma versão em arquivo único (fotos embutidas), que abre direto com duplo clique.
import base64,re,pathlib
src=pathlib.Path(__file__).with_name("index.html");out=src.with_name("jogo-3d-barcos-ia-realista.html")
s=src.read_text(encoding="utf-8")
def emb(m):
  p=src.parent/m.group(1)
  return '"data:image/jpeg;base64,'+base64.b64encode(p.read_bytes()).decode()+'"'
s=re.sub(r'"(assets/[\w.-]+\.jpg)"',emb,s)
out.write_text(s,encoding="utf-8");print(out,round(out.stat().st_size/1e6,2),"MB")

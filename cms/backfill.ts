/**
 * Preenche published_at das páginas que já estão no ar.
 *
 * A coluna foi criada depois que o site já tinha conteúdo publicado; sem este
 * preenchimento, toda página aparece como pendente no painel. O critério é o
 * que existe de fato: se a rota tem HTML gravado, ela está publicada.
 */
import fs from "node:fs";
import path from "node:path";
import { openDb, routeOf, REPO_DIR } from "./db";

const DIST = path.join(REPO_DIR, "dist", "public");
const arquivo = (rota: string) =>
  rota === "/" ? path.join(DIST, "index.html") : path.join(DIST, rota, "index.html");

const db = openDb();
const agora = new Date().toISOString().slice(0, 19).replace("T", " ");
const paginas = db.prepare("SELECT slug, kind, updated_at FROM pages").all() as any[];
const up = db.prepare("UPDATE pages SET published_at = ? WHERE slug = ?");

let marcadas = 0, fora = 0;
for (const p of paginas) {
  if (fs.existsSync(arquivo(routeOf(p)))) { up.run(agora, p.slug); marcadas++; }
  else fora++;
}
console.log(`${marcadas} páginas marcadas como publicadas · ${fora} sem HTML (seguem pendentes)`);

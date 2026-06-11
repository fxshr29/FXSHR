# Felix — Portfolio

Premium dark Portfolio-Website mit integriertem CMS. Läuft komplett statisch auf GitHub Pages — kein Server, keine Datenbank, keine Build-Tools.

**Live:** https://fxshr29.github.io/FXSHR/

## Struktur

| Datei | Zweck |
|---|---|
| `index.html` | Die Website (Hero, Work, About, Services, Preise, Kontakt) |
| `style.css` | Komplettes Design-System |
| `script.js` | Animationen, Interaktionen, CMS-Hydration |
| `content.json` | **Alle Inhalte** — Texte, Projekte, Services, Preise |
| `admin.html` | CMS-Panel zum Bearbeiten der Inhalte |

## Inhalte bearbeiten (CMS)

1. Öffne `https://fxshr29.github.io/FXSHR/admin.html`
2. Bearbeite Texte, Projekte, Services, Preispakete — alles per Formular
3. Klicke **Veröffentlichen** — beim ersten Mal wird ein GitHub-Token abgefragt:
   - GitHub → Settings → Developer settings → **Fine-grained tokens**
   - Repository: `fxshr29/FXSHR` · Permission: **Contents → Read and write**
   - Das Token bleibt nur lokal in deinem Browser gespeichert
4. Die Website aktualisiert sich automatisch in ~1 Minute

Alternativ: **JSON herunterladen** und `content.json` manuell ins Repo committen.

## Tech

- Vanilla HTML/CSS/JS — keine Dependencies, kein Build-Schritt
- Content-Hydration aus `content.json` (Fallback: statisches HTML)
- SEO: Meta, Open Graph, JSON-LD · `prefers-reduced-motion` Support

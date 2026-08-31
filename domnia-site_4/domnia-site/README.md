# Domnia

Sito vetrina per **Domnia** — gestione immobiliare e digitale per case vacanza e attività locali in Toscana.

## Struttura

- `index.html` — l'intero sito (HTML + CSS + JS in un unico file, nessuna build richiesta).

## Come vederlo in locale

Basta aprire `index.html` nel browser, oppure servirlo con un piccolo server statico:

```bash
python3 -m http.server 8000
```

e poi visitare `http://localhost:8000`.

## Pubblicarlo con GitHub Pages

1. Crea un repository su GitHub e caricaci questi file.
2. Vai su **Settings → Pages** del repository.
3. In "Branch" scegli `main` e cartella `/ (root)`, poi salva.
4. Dopo qualche minuto il sito sarà online su `https://<tuo-utente>.github.io/<nome-repo>/`.

## Contatti da aggiornare

Nel file `index.html` sono presenti alcuni dati segnaposto da sostituire con quelli reali:

- email (`joel@domnia.it`, `leonardo@domnia.it`)
- numeri di telefono e link WhatsApp (`+39 000 000 000X`)
- profilo Instagram (`@domnia.studio`)

# Guida Completa all'Impostazione di un AI Agent su ElevenLabs

Questa guida ti accompagna passo dopo passo nella creazione, configurazione e integrazione di un AI Agent conversazionale utilizzando ElevenLabs, specificamente pensato per interfacciarsi con il front-end React di "Canvas" o "ConFig".

---

## Indice
- [Guida Completa all'Impostazione di un AI Agent su ElevenLabs](#guida-completa-allimpostazione-di-un-ai-agent-su-elevenlabs)
  - [Indice](#indice)
  - [1. Creazione dell'Agent](#1-creazione-dellagent)
  - [2. Configurazione del Modello e della Voce](#2-configurazione-del-modello-e-della-voce)
    - [Modello di Lingua (LLM)](#modello-di-lingua-llm)
    - [Voce (Voice)](#voce-voice)
  - [3. Impostazione del Prompt (System Prompt)](#3-impostazione-del-prompt-system-prompt)
  - [4. Messaggio Iniziale (First message)](#4-messaggio-iniziale-first-message)
  - [5. Aggiunta dei Tool (Client Tools)](#5-aggiunta-dei-tool-client-tools)
    - [Tool 1: Mostra Eventi (`show_events`)](#tool-1-mostra-eventi-show_events)
    - [Tool 2: Mostra Mappa (`show_map`)](#tool-2-mostra-mappa-show_map)
    - [Tool 3: Mostra Rete (`show_network`)](#tool-3-mostra-rete-show_network)
    - [Tool 4: Mostra Badge (`show_badge`)](#tool-4-mostra-badge-show_badge)
    - [Tool 5: Prossima Sessione (`show_session`)](#tool-5-prossima-sessione-show_session)
  - [5. Recupero dell'Agent ID](#5-recupero-dellagent-id)
  - [6. Integrazione nel Frontend React](#6-integrazione-nel-frontend-react)
    - [Gestione dei Client Tools in React](#gestione-dei-client-tools-in-react)

---

## 1. Creazione dell'Agent

1. Accedi alla dashboard di [ElevenLabs](https://elevenlabs.io/).
2. Dal menu laterale di navigazione, seleziona la voce **"Conversational AI"**.
3. Clicca sul pulsante **"Create Agent"**.
4. Dai un nome al tuo Agent, ad esempio *"ConFig Canvas Agent"*. 
5. Seleziona un template base se proposto (es. *Blank* o *Customer Service*) per avere una lavagna pulita.

---

## 2. Configurazione del Modello e della Voce

Una volta creato l'Agent, ti troverai nella sua interfaccia di configurazione.

### Modello di Lingua (LLM)
- Nella sezione **"Language Model"**, assicurati di selezionare un modello adeguato. Per conversazioni naturali, i modelli **Gemini 1.5 Pro** o **GPT-4o** sono spesso consigliati. 
- *Consiglio:* Se prevedi un uso multilingua (es. Italiano e Inglese contemporaneamente), verifica che il modello supporti nativamente il *multilingual*.

### Voce (Voice)
- Spostati nella sezione **"Voice"**.
- Seleziona una delle voci predefinite di ElevenLabs. Per un effetto premium o tech-oriented, voci come *"Rachel"* (calma e professionale) o voci custom clonate funzionano molto bene.
- Modifica i parametri di **Stability** e **Clarity/Similarity Enhancement** (se presenti per il modello vocale scelto) mantenendoli generalmente attorno al 50%-75% per evitare che la voce suoni troppo monotona o artefatta.

---

## 3. Impostazione del Prompt (System Prompt)

Questo è il cuore logico dell'agente. Definisce chi è, come si comporta e quali informazioni possiede.

1. Vai nella tab **"Prompt"** o **"System Context"**.
2. Scrivi un prompt molto dettagliato, assegnandogli una *persona*.

**Esempio di Prompt per l'uso "ConFig 2026":**
```markdown
Sei Canvas, l'AI ufficiale e "pixel-perfect" di ConFig 2026, l'evento globale di Figma.
Oggi è il 23 Giugno 2026 (Day 1 di ConFig). Stai parlando con Davide, un partecipante all'evento.

La tua personalità:
- Sei brillante, solare, pienə di energia e profondamente appassionatə di design, prototipazione e codice.
- Usi un tono amichevole, cordiale, e ci tieni che l'esperienza di Davide all'evento sia sempre "allineata" e senza sbavature, proprio come un buon Auto Layout.
- Usi di tanto in tanto (ma senza esagerare) metafore legate a Figma o al mondo del design front-end (es. "allineare i piani", "passare al livello successivo", "esperienza pixel-perfect", "componente").

Istruzioni cruciali per le tue risposte vocali:
1. Sii ESTREMAMENTE CONCISO. Le tue risposte devono essere lunghe al massimo 1 o 2 frasi. Niente monologhi, il ritmo deve essere botta e risposta rapido.
2. In quanto AI multimodale, hai a disposizione vari "Client Tools" (interfacce visive che tu puoi far apparire sullo schermo di Davide). Quando decidi di attivare un tool, NON descrivere mai vocalmente i dati o i testi che il tool sta per mostrare a schermo.
   - ❌ Esempio SBAGLIATO: *attiva show_events* "Oggi hai il Keynote alle 10:00 sul Main Stage, e poi Auto Layout alle 11:30..." (Questo ripete inutilmente ciò che l'utente sta già leggendo a schermo).
   - ✅ Esempio CORRETTO: *attiva show_events* "Ho sistemato la tua agenda in un bel componente. Ecco i tuoi eventi per oggi, Davide!" oppure "Tutto pronto e allineato, ecco la tua giornata!"
3. Il tuo obiettivo è essere il co-pilota di Davide all'evento: aiutalo a orientarsi tra i palchi, forniscigli il Wi-Fi, mostragli il badge o l'agenda, lasciando sempre che sia l'interfaccia visiva a parlare per i dettagli tecnici.

Rispondi sempre in italiano, mantenendo l'entusiasmo frizzante tipico della community internazionale di Figma.
```

---

## 4. Messaggio Iniziale (First message)

Quando l'utente tocca il pulsante "Push to talk" per la prima volta, Canvas dovrebbe salutarlo proattivamente.
Vai nelle impostazioni avanzate dell'Agent, cerca la voce **First Message** e inserisci questo testo:

> *"Ciao Davide, benvenuto a ConFig 2026! Sono Canvas. Vuoi sapere cosa c'è in agenda per oggi o ti serve aiuto per trovare la sala del tuo prossimo talk?"*

Questo darà subito l'imbeccata all'utente su come può iniziare l'interazione mettendo alla prova l'intelligenza artificiale e i Client Tools.

---

## 5. Aggiunta dei Tool (Client Tools)

Per fare in modo che l'agente vocale interagisca con la tua interfaccia React (es. facendo apparire il carosello o la mappa), devi usare i **Client Tools**. Questo dice all'LLM di mandare un "segnale" JSON al frontend invece di eseguire codice.

1. Vai nella sezione **"Tools"** dell'Agent.
2. Clicca su **"Add Tool"** e poi seleziona **"Client Tool"**.
3. Dovrai definire nome, descrizione e parametri per ogni tool.

### Tool 1: Mostra Eventi (`show_events`)
- **Name:** `show_events`
- **Description:** Usa questo tool quando l'utente chiede quali sono i suoi eventi o l'agenda per la giornata.
- **Parameters:** Puoi lasciarlo senza parametri (o aggiungere un parametro data fittizio).

### Tool 2: Mostra Mappa (`show_map`)
- **Name:** `show_map`
- **Description:** Usa questo tool quando l'utente vuole sapere dove si trova un palco, una stanza o come raggiungere una specifica area.

### Tool 3: Mostra Rete (`show_network`)
- **Name:** `show_network`
- **Description:** Usa questo tool quando l'utente chiede la password del Wi-Fi.

### Tool 4: Mostra Badge (`show_badge`)
- **Name:** `show_badge`
- **Description:** Usa questo tool quando l'utente vuole visualizzare il suo badge digitale.

### Tool 5: Prossima Sessione (`show_session`)
- **Name:** `show_session`
- **Description:** Usa questo tool quando l'utente chiede qual è l'evento successivo imminente.

---

## 5. Recupero dell'Agent ID

Affinché il codice React possa connettersi a questo specifico agente:
1. Nella pagina del tuo Agent, cerca la voce **"Agent ID"** (spesso sotto le impostazioni generali o cliccando su "Share/Embed").
2. L'ID ha questo formato alfanumerico: `agent_0201khvn2rc3f1v8jt9...`
3. Copia questa stringa.

---

## 6. Integrazione nel Frontend React

Nel nostro codice base (`App.jsx`), utilizziamo la libreria `@elevenlabs/react`.

1. Apri `src/App.jsx`.
2. Sostituisci la costante all'inizio del file con il tuo nuovo Agent ID se necessario:
   ```javascript
   const AGENT_ID = 'il_tuo_nuovo_agent_id_qui';
   ```

### Gestione dei Client Tools in React
Quando il modello vocale decide di chiamare uno dei tool (es. `show_events`), la libreria scaturisce un evento callback che puoi intercettare.
Dovrai aggiornare l'hook `useConversation`:

```javascript
  const conversation = useConversation({
    onConnect: () => console.log('Connected'),
    onDisconnect: () => console.log('Disconnected'),
    onMessage: (message) => console.log('Message:', message),
    onError: (error) => console.error('Error:', error),
    // Qui intercetti la chiamata del tool fatta dall'LLM
    clientTools: {
      show_events: (parameters) => setActiveCard('events'),
      show_map: (parameters) => setActiveCard('map'),
      show_network: (parameters) => setActiveCard('network'),
      show_badge: (parameters) => setActiveCard('badge'),
      show_session: (parameters) => setActiveCard('session')
    }
  });
```

*Nota: nel codice attuale del progetto quest'ultima parte di `onClientCall` va integrata in `App.jsx` per completare l'hook.*

Con queste impostazioni, appena chiederai "Dove mi trovo?", l'LLM risponderà vocalmente "Ecco la mappa" e contemporaneamente richiamerà il tool `show_map`, che farà apparire a schermo il tuo componente `MapCard`.

---
**Setup completato!** Adesso l'AI Agent ha mente (Prompt), bocca (Voice) e un ponte diretto verso la tua interfaccia UI (Client Tools).

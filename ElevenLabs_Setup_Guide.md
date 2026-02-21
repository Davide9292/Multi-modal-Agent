# Guida Completa all'Impostazione di un AI Agent su ElevenLabs

Questa guida ti accompagna passo dopo passo nella creazione, configurazione e integrazione di un AI Agent conversazionale utilizzando ElevenLabs, specificamente pensato per interfacciarsi con il front-end React di "Canvas" o "ConFig".

---

## Indice
1. [Creazione dell'Agent](#1-creazione-dellagent)
2. [Configurazione del Modello e della Voce](#2-configurazione-del-modello-e-della-voce)
3. [Impostazione del Prompt (System Prompt)](#3-impostazione-del-prompt-system-prompt)
4. [Aggiunta dei Tool (Client Tools)](#4-aggiunta-dei-tool-client-tools)
5. [Recupero dell'Agent ID](#5-recupero-dellagent-id)
6. [Integrazione nel Frontend React](#6-integrazione-nel-frontend-react)

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
Sei Canvas, l'intelligenza artificiale ufficiale dell'evento ConFig 2026 ospitato da Figma.
Oggi è il 23 Giugno 2026. L'utente che ti parla è Davide, un partecipante all'evento.

Il tuo scopo è assisterlo con informazioni sull'evento, orari, indicazioni stradali e impostazioni di rete.
Le tue risposte devono essere sempre estremamente brevi, concise (massimo 1-2 frasi) e cordiali.
Non spiegare tutto vocalmente se stai contemporaneamente triggerando un tool visivo (Client Tool). Lascia che sia l'interfaccia a mostrare i dati, tu limitati a dire frasi come: "Certo Davide, ecco gli eventi in programma per oggi:"
```

---

## 4. Aggiunta dei Tool (Client Tools)

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
    onClientCall: (toolCall) => {
      console.log("Tool chiamato dall'AI:", toolCall.name);
      
      // Mappiamo il nome del tool con i nostri componenti UI
      if (toolCall.name === 'show_events') setActiveCard('events');
      if (toolCall.name === 'show_map') setActiveCard('map');
      if (toolCall.name === 'show_network') setActiveCard('network');
      if (toolCall.name === 'show_badge') setActiveCard('badge');
      if (toolCall.name === 'show_session') setActiveCard('session');
    }
  });
```

*Nota: nel codice attuale del progetto quest'ultima parte di `onClientCall` va integrata in `App.jsx` per completare l'hook.*

Con queste impostazioni, appena chiederai "Dove mi trovo?", l'LLM risponderà vocalmente "Ecco la mappa" e contemporaneamente richiamerà il tool `show_map`, che farà apparire a schermo il tuo componente `MapCard`.

---
**Setup completato!** Adesso l'AI Agent ha mente (Prompt), bocca (Voice) e un ponte diretto verso la tua interfaccia UI (Client Tools).

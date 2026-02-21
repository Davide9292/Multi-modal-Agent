import { useState, useCallback, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useConversation } from '@elevenlabs/react';
import Header from './components/Header';
import VoiceOrb from './components/VoiceOrb';
import BadgeCard from './components/ToolCards/BadgeCard';
import SessionCard from './components/ToolCards/SessionCard';
import NetworkCard from './components/ToolCards/NetworkCard';
import EventsCarousel from './components/ToolCards/EventsCarousel';
import MapCard from './components/ToolCards/MapCard';
import DebugControls from './components/DebugControls';

const AGENT_ID = 'agent_0201khvn2rc3f1v8jt9a1pdbj8e0';

const toolCards = {
  badge: BadgeCard,
  session: SessionCard,
  network: NetworkCard,
  events: EventsCarousel,
  map: MapCard,
};

export default function App() {
  /* ── Debug override state ── */
  const [debugState, setDebugState] = useState(null);   // null = use live state
  const [activeCard, setActiveCard] = useState(null);
  const [isPaused, setIsPaused] = useState(false);

  /* ── ElevenLabs Conversation ── */
  const conversation = useConversation({
    onConnect: () => console.log('[Canvas] Connected to agent'),
    onDisconnect: () => console.log('[Canvas] Disconnected'),
    onMessage: (message) => {
      console.log('[Canvas] Message:', message);
      // Nascondiamo qualsiasi UI card aperta al momento in cui l'utente fa una nuova richiesta
      if (message.source === 'user' || message.role === 'user') {
        setActiveCard(null);
      }
    },
    onError: (error) => console.error('[Canvas] Error:', error),
    onModeChange: ({ mode }) => console.log('[Canvas] Mode:', mode),

    // Intercetta la chiamata ai tool (Client Tools) da parte di ElevenLabs
    clientTools: {
      show_events: (parameters) => {
        console.log("[Canvas] Tool chiamato dall'AI: show_events", parameters);
        setActiveCard('events');
      },
      show_map: (parameters) => {
        console.log("[Canvas] Tool chiamato dall'AI: show_map", parameters);
        setActiveCard('map');
      },
      show_network: (parameters) => {
        console.log("[Canvas] Tool chiamato dall'AI: show_network", parameters);
        setActiveCard('network');
      },
      show_badge: (parameters) => {
        console.log("[Canvas] Tool chiamato dall'AI: show_badge", parameters);
        setActiveCard('badge');
      },
      show_session: (parameters) => {
        console.log("[Canvas] Tool chiamato dall'AI: show_session", parameters);
        setActiveCard('session');
      }
    }
  });

  /* ── Derived agent state ── */
  const agentState = useMemo(() => {
    // Debug override takes priority
    if (debugState) return debugState;

    // Map ElevenLabs status + isSpeaking to our 3 states
    if (conversation.status !== 'connected') return 'idle';
    if (conversation.isSpeaking) return 'speaking';
    return 'listening';
  }, [debugState, conversation.status, conversation.isSpeaking]);

  /* ── Start / Stop / Pause conversation ── */
  const handleStart = useCallback(async () => {
    try {
      setIsPaused(false);
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await conversation.startSession({
        agentId: AGENT_ID,
        connectionType: 'webrtc',
      });
    } catch (err) {
      console.error('[Canvas] Failed to start session:', err);
    }
  }, [conversation]);

  const handleStop = useCallback(() => {
    conversation.endSession();
    setIsPaused(false);
  }, [conversation]);

  const handleTogglePause = useCallback(async () => {
    try {
      const nextPaused = !isPaused;
      setIsPaused(nextPaused);
      if (conversation.setVolume) {
        conversation.setVolume({ volume: nextPaused ? 0 : 1 });
      }
      // Depending on ElevenLabs SDK version, setInputMuted might exist
      if (typeof conversation.setInputMuted === 'function') {
        await conversation.setInputMuted(nextPaused);
      }
    } catch (err) {
      console.error('[Canvas] Failed to toggle pause:', err);
    }
  }, [conversation, isPaused]);

  /* ── Orb interaction ── */
  const handleOrbTap = useCallback(() => {
    if (conversation.status !== 'connected') {
      handleStart();
    }
  }, [conversation.status, handleStart]);

  /* ── Debug controls wrapper (sets override or clears it) ── */
  const handleDebugStateChange = useCallback((state) => {
    setDebugState(prev => prev === state ? null : state);
  }, []);

  const ActiveCardComponent = activeCard ? toolCards[activeCard] : null;

  return (
    <div className="flex flex-col items-center min-h-[100dvh] w-full pt-safe pb-safe overflow-hidden">
      <Header agentState={agentState} />

      {/* Central area – orb */}
      <VoiceOrb
        agentState={agentState}
        isPaused={isPaused}
        onPointerDown={handleOrbTap}
        onPointerUp={() => { }}
        onStop={handleStop}
        onTogglePause={handleTogglePause}
      />

      {/* Tool card overlay */}
      <div className="w-full px-4 py-6 flex-1 flex items-center justify-center min-h-[220px]">
        <AnimatePresence mode="wait">
          {ActiveCardComponent && <ActiveCardComponent key={activeCard} />}
        </AnimatePresence>
      </div>

      {/* Debug controls */}
      <DebugControls
        agentState={debugState || agentState}
        setAgentState={handleDebugStateChange}
        activeCard={activeCard}
        setActiveCard={setActiveCard}
      />
    </div>
  );
}

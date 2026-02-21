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

  /* ── ElevenLabs Conversation ── */
  const conversation = useConversation({
    onConnect: () => console.log('[Canvas] Connected to agent'),
    onDisconnect: () => console.log('[Canvas] Disconnected'),
    onMessage: (message) => console.log('[Canvas] Message:', message),
    onError: (error) => console.error('[Canvas] Error:', error),
    onModeChange: ({ mode }) => console.log('[Canvas] Mode:', mode),

    // Intercetta la chiamata ai tool (Client Tools) da parte di ElevenLabs
    onClientCall: (toolCall) => {
      console.log("[Canvas] Tool chiamato dall'AI:", toolCall.name);

      switch (toolCall.name) {
        case 'show_events':
          setActiveCard('events');
          break;
        case 'show_map':
          setActiveCard('map');
          break;
        case 'show_network':
          setActiveCard('network');
          break;
        case 'show_badge':
          setActiveCard('badge');
          break;
        case 'show_session':
          setActiveCard('session');
          break;
        default:
          setActiveCard(null);
          break;
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

  /* ── Start / Stop conversation ── */
  const handleStart = useCallback(async () => {
    try {
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
  }, [conversation]);

  /* ── Orb interaction ── */
  const handleOrbTap = useCallback(() => {
    if (conversation.status === 'connected') {
      handleStop();
    } else {
      handleStart();
    }
  }, [conversation.status, handleStart, handleStop]);

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
        onPointerDown={handleOrbTap}
        onPointerUp={() => { }}
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

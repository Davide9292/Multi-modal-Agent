import { useState, useCallback, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useConversation } from '@elevenlabs/react';
import Header from './components/Header';
import VoiceOrb from './components/VoiceOrb';
import BadgeCard from './components/ToolCards/BadgeCard';
import SessionCard from './components/ToolCards/SessionCard';
import NetworkCard from './components/ToolCards/NetworkCard';
import DebugControls from './components/DebugControls';

const AGENT_ID = 'agent_0201khvn2rc3f1v8jt9a1pdbj8e0';

const toolCards = {
  badge: BadgeCard,
  session: SessionCard,
  network: NetworkCard,
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
    <div className="flex flex-col items-center min-h-screen w-full">
      <Header agentState={agentState} />

      {/* Central area – orb */}
      <VoiceOrb
        agentState={agentState}
        onPointerDown={handleOrbTap}
        onPointerUp={() => { }}
      />

      {/* Tool card overlay */}
      <div className="w-full px-4 py-4 flex items-center justify-center min-h-[180px]">
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

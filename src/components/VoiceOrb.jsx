import { motion, AnimatePresence } from 'framer-motion';
import { useMemo } from 'react';

/* ── Mic Icon (SVG) ── */
function MicIcon({ className }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="2" width="6" height="12" rx="3" />
            <path d="M5 10a7 7 0 0 0 14 0" />
            <line x1="12" y1="19" x2="12" y2="22" />
            <line x1="8" y1="22" x2="16" y2="22" />
        </svg>
    );
}

function PauseIcon({ className }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
        </svg>
    );
}

function PlayIcon({ className }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <polygon points="6 3 20 12 6 21 6 3" strokeLinejoin="round" />
        </svg>
    );
}

function StopIcon({ className }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <rect x="6" y="6" width="12" height="12" rx="2" ry="2" />
        </svg>
    );
}

/* ── Blob paths for speaking state ── */
const blobPaths = [
    'M44,0 C68.3,0 88,19.7 88,44 C88,68.3 68.3,88 44,88 C19.7,88 0,68.3 0,44 C0,19.7 19.7,0 44,0 Z',
    'M44,2 C62,0 90,18 86,44 C82,70 66,90 44,86 C22,82 -2,68 2,44 C6,20 26,4 44,2 Z',
    'M44,0 C70,4 92,22 84,48 C76,74 62,88 40,86 C18,84 0,66 4,40 C8,14 18,-4 44,0 Z',
    'M48,2 C72,8 88,28 82,52 C76,76 56,90 36,84 C16,78 -2,58 4,36 C10,14 24,-4 48,2 Z',
];

const figmaColors = [
    { color: '#F24E1E', glow: 'rgba(242,78,30,0.4)' },
    { color: '#A259FF', glow: 'rgba(162,89,255,0.4)' },
    { color: '#1ABCFE', glow: 'rgba(26,188,254,0.4)' },
    { color: '#0ACF83', glow: 'rgba(10,207,131,0.4)' },
    { color: '#FF7262', glow: 'rgba(255,114,98,0.4)' },
];

export default function VoiceOrb({ agentState, isPaused, onPointerDown, onPointerUp, onStop, onTogglePause }) {
    const isIdle = agentState === 'idle';
    const isListening = agentState === 'listening';
    const isSpeaking = agentState === 'speaking';

    /* Generate blob layers for speaking */
    const blobs = useMemo(() =>
        figmaColors.map((c, i) => ({
            ...c,
            paths: blobPaths,
            delay: i * 0.3,
            scale: 1 + i * 0.06,
        })), []
    );

    return (
        <div className="relative flex items-center justify-center flex-1 w-full">
            {/* Outer glow rings for listening */}
            <AnimatePresence>
                {isListening && (
                    <>
                        {[0, 1, 2].map(i => (
                            <motion.div
                                key={`ring-${i}`}
                                className="absolute rounded-full border border-figma-purple/30"
                                style={{ width: 180 + i * 40, height: 180 + i * 40 }}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: [0.4, 0], scale: [1, 1.3] }}
                                exit={{ opacity: 0 }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: i * 0.5,
                                    ease: 'easeOut',
                                }}
                            />
                        ))}
                    </>
                )}
            </AnimatePresence>

            {/* Speaking blobs */}
            <AnimatePresence>
                {isSpeaking && (
                    <motion.div
                        className="absolute"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <svg width="220" height="220" viewBox="0 0 88 88" className="overflow-visible">
                            {blobs.map((blob, i) => (
                                <motion.path
                                    key={i}
                                    d={blob.paths[0]}
                                    fill="none"
                                    stroke={blob.color}
                                    strokeWidth="1"
                                    opacity={0.5}
                                    style={{
                                        filter: `drop-shadow(0 0 12px ${blob.glow})`,
                                        transformOrigin: '44px 44px',
                                    }}
                                    animate={{
                                        d: blob.paths,
                                        rotate: [0, 360],
                                        scale: [blob.scale, blob.scale * 1.08, blob.scale],
                                    }}
                                    transition={{
                                        d: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: blob.delay },
                                        rotate: { duration: 12 + i * 2, repeat: Infinity, ease: 'linear' },
                                        scale: { duration: 2, repeat: Infinity, ease: 'easeInOut', delay: blob.delay },
                                    }}
                                />
                            ))}
                        </svg>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Central container */}
            <motion.div
                className={`
          relative z-10 w-36 h-36 sm:w-40 sm:h-40 rounded-full flex items-center justify-center
          select-none outline-none border-0
          ${isIdle ? 'gradient-border cursor-pointer' : ''}
        `}
                style={{
                    background: isListening
                        ? 'radial-gradient(circle, #2A2A2A 60%, #1E1E1E 100%)'
                        : isSpeaking
                            ? 'radial-gradient(circle, rgba(42,42,42,0.8) 40%, rgba(30,30,30,0.6) 100%)'
                            : '#232323',
                }}
                whileTap={isIdle ? { scale: 0.95 } : {}}
                animate={
                    isListening
                        ? {
                            boxShadow: [
                                '0 0 0px 0px rgba(162,89,255,0.0)',
                                '0 0 30px 8px rgba(162,89,255,0.25)',
                                '0 0 0px 0px rgba(162,89,255,0.0)',
                            ]
                        }
                        : isSpeaking
                            ? { boxShadow: '0 0 40px 10px rgba(26,188,254,0.15)' }
                            : { boxShadow: '0 0 0px 0px rgba(0,0,0,0)' }
                }
                transition={isListening ? { duration: 2, repeat: Infinity } : { duration: 0.5 }}
                onPointerDown={isIdle ? onPointerDown : undefined}
                onPointerUp={isIdle ? onPointerUp : undefined}
            >
                {isIdle ? (
                    <motion.div>
                        <MicIcon
                            className="w-8 h-8 sm:w-9 sm:h-9 text-secondary-text transition-colors duration-300"
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        className="flex gap-4 sm:gap-5 items-center justify-center z-20"
                        animate={isListening ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                        transition={isListening ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' } : {}}
                    >
                        {/* Pause Toggle */}
                        <button
                            onClick={(e) => { e.stopPropagation(); onTogglePause(); }}
                            onPointerDown={(e) => e.stopPropagation()}
                            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-colors cursor-pointer border border-white/10
                                      ${isPaused ? 'bg-figma-purple/20 text-figma-purple border-figma-purple/30 shadow-[0_0_15px_rgba(162,89,255,0.3)]' : 'bg-white/5 hover:bg-white/10 text-primary-text'}`}
                        >
                            {isPaused ? <PlayIcon className="w-4 h-4 sm:w-5 sm:h-5 ml-1" /> : <PauseIcon className="w-4 h-4 sm:w-5 sm:h-5" />}
                        </button>

                        {/* Stop Action */}
                        <button
                            onClick={(e) => { e.stopPropagation(); onStop(); }}
                            onPointerDown={(e) => e.stopPropagation()}
                            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#1E1E1E] border border-figma-red/30 text-figma-red shadow-[0_0_15px_rgba(242,78,30,0.2)] hover:bg-figma-red/10 transition-colors flex items-center justify-center cursor-pointer"
                        >
                            <StopIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                    </motion.div>
                )}

                {/* Inner label */}
                <motion.span
                    className="absolute -bottom-8 text-[10px] tracking-widest uppercase font-medium text-secondary-text/60"
                    animate={{ opacity: isIdle ? 1 : 0 }}
                >
                    Push to talk
                </motion.span>
            </motion.div>
        </div>
    );
}

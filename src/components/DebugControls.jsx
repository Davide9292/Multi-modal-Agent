export default function DebugControls({ agentState, setAgentState, activeCard, setActiveCard }) {
    const states = ['idle', 'listening', 'speaking'];
    const cards = [
        { key: 'badge', label: 'Badge' },
        { key: 'session', label: 'Session' },
        { key: 'network', label: 'Network' },
    ];

    return (
        <div className="w-full px-4 pb-5 pt-2 opacity-30 hover:opacity-100 transition-opacity duration-300">
            <div className="flex flex-wrap items-center justify-center gap-2 text-[11px]">
                {/* Agent state toggles */}
                <span className="text-secondary-text/60 font-mono uppercase tracking-wider mr-1">State</span>
                {states.map(s => (
                    <button
                        key={s}
                        onClick={() => setAgentState(s)}
                        className={`px-3 py-1 rounded-lg font-medium tracking-wide cursor-pointer transition-colors border
              ${agentState === s
                                ? 'bg-white/10 text-primary-text border-white/20'
                                : 'bg-white/[0.03] text-secondary-text/60 border-white/[0.06] hover:bg-white/[0.06]'}
            `}
                    >
                        {s}
                    </button>
                ))}

                <span className="w-px h-4 bg-white/10 mx-1" />

                {/* Card toggles */}
                <span className="text-secondary-text/60 font-mono uppercase tracking-wider mr-1">Card</span>
                {cards.map(c => (
                    <button
                        key={c.key}
                        onClick={() => setActiveCard(activeCard === c.key ? null : c.key)}
                        className={`px-3 py-1 rounded-lg font-medium tracking-wide cursor-pointer transition-colors border
              ${activeCard === c.key
                                ? 'bg-white/10 text-primary-text border-white/20'
                                : 'bg-white/[0.03] text-secondary-text/60 border-white/[0.06] hover:bg-white/[0.06]'}
            `}
                    >
                        {c.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

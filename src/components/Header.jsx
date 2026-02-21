import { motion } from 'framer-motion';

export default function Header({ agentState }) {
    const isActive = agentState !== 'idle';

    return (
        <header className="w-full flex items-center justify-between px-5 py-4 sm:px-8 sm:py-5">
            {/* Logo */}
            <div className="flex items-center gap-2">
                <span className="text-xs font-semibold tracking-widest uppercase text-secondary-text">
                    ConFig
                </span>
                <span className="text-xs font-light tracking-widest uppercase text-secondary-text/50">
                    2026
                </span>
            </div>

            {/* Status Indicator */}
            <div className="flex items-center gap-2 glass rounded-full px-3 py-1.5">
                <motion.div
                    className="w-2 h-2 rounded-full"
                    style={{
                        backgroundColor: isActive ? '#0ACF83' : '#A3A3A3',
                    }}
                    animate={isActive ? {
                        boxShadow: [
                            '0 0 0px 0px rgba(10, 207, 131, 0.4)',
                            '0 0 8px 3px rgba(10, 207, 131, 0.4)',
                            '0 0 0px 0px rgba(10, 207, 131, 0.4)',
                        ],
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-[11px] font-medium tracking-wide text-secondary-text">
                    Canvas AI
                </span>
            </div>
        </header>
    );
}

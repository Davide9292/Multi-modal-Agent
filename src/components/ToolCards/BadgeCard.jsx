import { motion } from 'framer-motion';

/* Placeholder QR grid */
function QRPlaceholder() {
    const cells = [];
    for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
            const filled =
                (r < 3 && c < 3) || (r < 3 && c > 3) || (r > 3 && c < 3) ||
                Math.random() > 0.5;
            cells.push(
                <rect
                    key={`${r}-${c}`}
                    x={c * 6}
                    y={r * 6}
                    width="5"
                    height="5"
                    rx="0.5"
                    fill={filled ? 'rgba(245,245,245,0.7)' : 'rgba(245,245,245,0.1)'}
                />
            );
        }
    }
    return (
        <svg width="42" height="42" viewBox="0 0 42 42">
            {cells}
        </svg>
    );
}

const cardVariants = {
    hidden: { opacity: 0, y: 24, scale: 0.96 },
    visible: {
        opacity: 1, y: 0, scale: 1,
        transition: { type: 'spring', stiffness: 260, damping: 24 },
    },
    exit: {
        opacity: 0, y: 16, scale: 0.97,
        transition: { duration: 0.25 },
    },
};

export default function BadgeCard() {
    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="mesh-gradient rounded-3xl p-6 w-full max-w-[280px] mx-auto
                 border border-white/[0.06] shadow-2xl flex flex-col items-center gap-5"
        >
            {/* Top accent bar */}
            <div className="w-10 h-1 rounded-full bg-gradient-to-r from-figma-red via-figma-purple to-figma-blue opacity-70" />

            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-surface-light border-2 border-white/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-figma-green">AJ</span>
            </div>

            {/* Info */}
            <div className="text-center space-y-1">
                <h3 className="text-lg font-semibold text-primary-text tracking-tight">Alex Johnson</h3>
                <p className="text-xs font-medium text-figma-purple tracking-wide uppercase">Product Designer</p>
                <p className="text-[11px] text-secondary-text">Figma Inc.</p>
            </div>

            {/* QR */}
            <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                <QRPlaceholder />
            </div>

            {/* Badge id */}
            <span className="text-[10px] tracking-[0.2em] uppercase text-secondary-text/50 font-mono">
                CFG-2026-4821
            </span>
        </motion.div>
    );
}

import { motion } from 'framer-motion';

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

export default function NetworkCard() {
    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="glass rounded-3xl p-5 w-full max-w-[320px] mx-auto
                 border border-white/[0.06] shadow-2xl"
        >
            <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-figma-blue/30 to-figma-purple/30
                        border border-white/10 flex items-center justify-center shrink-0">
                    <span className="text-lg font-bold text-figma-blue">SK</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 space-y-0.5">
                    <h3 className="text-[15px] font-semibold text-primary-text truncate">Sara Kim</h3>
                    <p className="text-xs text-secondary-text truncate">Senior Engineer · Stripe</p>
                </div>

                {/* Connect button */}
                <button className="shrink-0 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide
                           bg-figma-blue/15 text-figma-blue border border-figma-blue/20
                           hover:bg-figma-blue/25 transition-colors cursor-pointer">
                    Connect
                </button>
            </div>
        </motion.div>
    );
}

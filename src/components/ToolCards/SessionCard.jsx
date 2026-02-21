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

function ClockIcon() {
    return (
        <svg className="w-4 h-4 text-figma-orange" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    );
}

function PinIcon() {
    return (
        <svg className="w-4 h-4 text-figma-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    );
}

export default function SessionCard() {
    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="glass rounded-3xl p-5 w-full max-w-[360px] mx-auto
                 border border-white/[0.06] shadow-2xl space-y-4"
        >
            {/* Title row */}
            <div className="space-y-1">
                <span className="text-[10px] tracking-widest uppercase font-medium text-figma-green">
                    Up Next
                </span>
                <h3 className="text-base font-semibold text-primary-text leading-snug">
                    The Future of Auto Layout
                </h3>
            </div>

            {/* Meta */}
            <div className="flex flex-wrap gap-4 text-[13px] text-secondary-text">
                <span className="flex items-center gap-1.5">
                    <ClockIcon />
                    11:30 AM
                </span>
                <span className="flex items-center gap-1.5">
                    <PinIcon />
                    Main Stage, Floor 1
                </span>
            </div>

            {/* Action */}
            <button className="w-full py-2.5 rounded-xl text-sm font-semibold tracking-wide
                         bg-figma-green/15 text-figma-green border border-figma-green/20
                         hover:bg-figma-green/25 transition-colors cursor-pointer">
                + Add to Agenda
            </button>
        </motion.div>
    );
}

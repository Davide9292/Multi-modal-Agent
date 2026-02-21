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

function MapPinIcon() {
    return (
        <svg className="w-5 h-5 text-figma-red" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    );
}

export default function MapCard() {
    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="glass rounded-3xl p-1 w-full max-w-[400px] mx-auto
                 border border-white/[0.06] shadow-2xl overflow-hidden"
        >
            <div className="relative w-full h-[200px] sm:h-[240px] rounded-[1.4rem] overflow-hidden bg-[#2A2A2A]">
                {/* Mock Map Background (Abstract lines) */}
                <div className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
                        backgroundSize: '20px 20px',
                    }}
                />

                {/* Route Path Mockup */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 240" fill="none">
                    <path d="M100 200 L150 150 L250 150 L300 100" stroke="#0ACF83" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="8 8" className="animate-pulse" />
                </svg>

                {/* Current Location Pin */}
                <div className="absolute top-[180px] left-[90px] w-4 h-4 rounded-full bg-figma-blue border-2 border-white shadow-[0_0_10px_rgba(26,188,254,0.6)] animate-pulse" />

                {/* Destination Pin */}
                <div className="absolute top-[75px] left-[288px] flex flex-col items-center">
                    <MapPinIcon />
                    <div className="mt-1 px-2 py-0.5 bg-figma-red/20 border border-figma-red/30 rounded-md text-[10px] font-bold text-white shadow-lg backdrop-blur-md">
                        Main Stage
                    </div>
                </div>
            </div>

            <div className="p-4 space-y-2">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-base font-semibold text-primary-text leading-snug">
                            Main Stage
                        </h3>
                        <p className="text-[12px] text-secondary-text">Floor 1, North Wing</p>
                    </div>
                    <div className="text-right">
                        <span className="text-[14px] font-bold text-figma-green">2 min</span>
                        <p className="text-[10px] text-secondary-text uppercase tracking-widest">Walk</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

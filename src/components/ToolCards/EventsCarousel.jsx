import { motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

const containerVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1, y: 0,
        transition: { type: 'spring', stiffness: 260, damping: 24, staggerChildren: 0.1 },
    },
    exit: {
        opacity: 0, y: 16,
        transition: { duration: 0.25 },
    },
};

const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
};

const mockEvents = [
    {
        id: 1,
        time: "10:00 AM",
        title: "Opening Keynote",
        location: "Main Stage",
        color: "figma-purple",
    },
    {
        id: 2,
        time: "11:30 AM",
        title: "The Future of Auto Layout",
        location: "Main Stage, Floor 1",
        color: "figma-green",
    },
    {
        id: 3,
        time: "2:00 PM",
        title: "Variables Deep Dive",
        location: "Room A, Floor 2",
        color: "figma-blue",
    },
    {
        id: 4,
        time: "4:00 PM",
        title: "Developer Handoff Best Practices",
        location: "Room B, Floor 2",
        color: "figma-orange",
    }
];

function ClockIcon({ colorClass }) {
    return (
        <svg className={`w-3.5 h-3.5 text-${colorClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    );
}

function PinIcon({ colorClass }) {
    return (
        <svg className={`w-3.5 h-3.5 text-${colorClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    );
}

export default function EventsCarousel() {
    const scrollRef = useRef(null);

    // Optional: Add simple drag-to-scroll functionality if desired, or let native CSS overflow-x handle it.

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full flex flex-col space-y-3"
        >
            <div className="px-2">
                <span className="text-[11px] tracking-widest uppercase font-medium text-secondary-text">
                    June 23rd • Agenda
                </span>
                <h2 className="text-lg font-semibold text-primary-text">Your Scheduled Events</h2>
            </div>

            <div
                ref={scrollRef}
                className="w-full overflow-x-auto pb-4 pt-2 px-2 flex gap-4 snap-x snap-mandatory hide-scrollbar"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {mockEvents.map((event) => (
                    <motion.div
                        key={event.id}
                        variants={cardVariants}
                        className="flex-none w-[280px] sm:w-[320px] glass rounded-3xl p-5 border border-white/[0.06] shadow-xl snap-center flex flex-col justify-between"
                    >
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <span className={`text-[10px] tracking-widest uppercase font-medium text-${event.color}`}>
                                    {event.time}
                                </span>
                                <h3 className="text-[15px] font-semibold text-primary-text leading-snug">
                                    {event.title}
                                </h3>
                            </div>
                            <div className="flex flex-col gap-2 text-[12px] text-secondary-text">
                                <span className="flex items-center gap-2">
                                    <ClockIcon colorClass={event.color} />
                                    {event.time}
                                </span>
                                <span className="flex items-center gap-2">
                                    <PinIcon colorClass={event.color} />
                                    {event.location}
                                </span>
                            </div>
                        </div>

                        <button className={`mt-5 w-full py-2 rounded-xl text-[13px] font-semibold tracking-wide
                           bg-${event.color}/10 text-${event.color} border border-${event.color}/20
                           hover:bg-${event.color}/20 transition-colors cursor-pointer`}>
                            View Details
                        </button>
                    </motion.div>
                ))}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        .hide-scrollbar::-webkit-scrollbar {
            display: none;
        }
      `}} />
        </motion.div>
    );
}

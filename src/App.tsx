import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ChevronRight, ChevronLeft, Share2, Info, Atom, Activity, Database, Menu, X, Globe, Play, Volume2, VolumeX, SkipForward } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

/**
 * ------------------------------------------------------------------
 * DATA & CONFIGURATION
 * ------------------------------------------------------------------
 */

// AQUI: Referência direta aos assets.
// Certifique-se de que estes ficheiros estão na pasta /public do seu projeto.
const HERO_IMAGE_URL = "/avra3.png";
const VIDEO_INTRO_1 = "/avra1.mp4"; // "I'm Avra..."
const VIDEO_INTRO_2 = "/avra2.mp4"; // "3i Atlas... An arrival..."

const INTRO_SEQUENCE = [
    {
        id: 1,
        src: VIDEO_INTRO_1,
        label: "Profile: Avra (A'uwẽ Uptabi)",
        quote: "Come with me on this adventure."
    },
    {
        id: 2,
        src: VIDEO_INTRO_2,
        label: "Subject: 3i Atlas",
        quote: "An arrival that changed everything."
    }
];

const NARRATIVE_DATA = [
    {
        id: 1,
        slug: 'discovery',
        title: "3I/ATLAS Discovery",
        subtitle: "MPC Circular 2025-07-01",
        narrative: "The interstellar object 3I/ATLAS was discovered on July 1st, 2025. Heliocentric excess velocity: 54.3 ± 2.1 km/s. Perihelion: 1.36 ± 0.05 AU. This is not 'Oumuamua. This is something else entirely.",
        type: 'intro',
        scientificData: {
            type: 'trajectory',
            value: "v∞ = 54.3 km/s"
        },
        theme: 'emerald'
    },
    {
        id: 2,
        slug: 'spectroscopy',
        title: "Spectroscopic Anomalies",
        subtitle: "JWST/NIRSpec + VLT/X-SHOOTER",
        narrative: "CO₂-dominated composition. But the metal enrichment is extreme—Ni/Fe ratios at 6.8, far above solar. And the CN/CO₂ ratio? 432. That shouldn't be possible in a natural comet.",
        type: 'discovery',
        scientificData: {
            type: 'composition',
            value: "CO₂/H₂O = 8.2 ± 0.5"
        },
        theme: 'cyan'
    },
    {
        id: 3,
        slug: 'jets',
        title: "Collimated Jet Structure",
        subtitle: "VLT/SPHERE Imaging",
        narrative: "The jets aren't diffuse like normal cometary outgassing. They're collimated—28° divergence angle. Like they're coming from engineered cavities. Or nozzles.",
        type: 'analysis',
        scientificData: {
            type: 'geometry',
            value: "Jet FWHM = 28.0° ± 8°"
        },
        theme: 'violet'
    },
    {
        id: 4,
        slug: 'rotation',
        title: "Rotational Dynamics",
        subtitle: "Photometric Period Analysis",
        narrative: "It tumbles every 15.7 hours. Perfectly periodic. No damping. No precession. Either it's a rigid body with extreme moment-of-inertia symmetry, or something is actively stabilizing it.",
        type: 'conflict',
        scientificData: {
            type: 'dynamics',
            value: "P = 15.7 ± 0.4 h"
        },
        theme: 'amber'
    },
    {
        id: 5,
        slug: 'acceleration',
        title: "The Acceleration Paradox",
        subtitle: "Non-Gravitational Force Analysis",
        narrative: "Measured acceleration: 2.3 × 10⁻⁶ m/s². Standard sublimation models predict 10⁻⁸ to 10⁻⁵. We're at the upper edge—or beyond. The momentum transfer doesn't match the observed outgassing.",
        type: 'data-heavy',
        scientificData: {
            type: 'chart',
            label: "Acceleration: Observed vs Predicted"
        },
        theme: 'rose'
    },
    {
        id: 6,
        slug: 'bayesian',
        title: "Bayesian Hypothesis Testing",
        subtitle: "H_N vs H_A Comparison",
        narrative: "We ran the numbers. Bayes factor of 2-4 favoring active control over passive sublimation. But the posterior depends entirely on your prior. If you assume artifacts are rare, the probability is 10⁻¹⁶. If you assume 10% of interstellar objects are artificial? 25%.",
        type: 'reflection',
        scientificData: {
            type: 'statistics',
            value: "BF(A/N) ≈ 2-4"
        },
        theme: 'emerald'
    },
    {
        id: 7,
        slug: 'observational-program',
        title: "Three-Phase Protocol",
        subtitle: "Discrimination Strategy",
        narrative: "We need more data. Phase 1: Spectroscopic monitoring over 12 weeks. Phase 2: Precision photometry for 24 weeks. Phase 3: High-resolution imaging. If these don't resolve it, we recommend sample return.",
        type: 'choice',
        scientificData: {
            type: 'timeline',
            value: "Launch Window: 2027"
        },
        theme: 'blue'
    },
    {
        id: 8,
        slug: 'conclusion',
        title: "The Question Remains Open",
        subtitle: "Investigation Status: Active",
        narrative: "We don't know what 3I/ATLAS is. Natural cometesimal from a CO₂-rich disk? Differentiated planetesimal fragment? Or something designed? The answer isn't in speculation. It's in observation. The data is yours now.",
        type: 'outro',
        scientificData: {
            type: 'status',
            value: "Sampling Justified"
        },
        theme: 'slate'
    }
];

// Real Data for Page 5 (The Acceleration Paradox)
// Based on the scientific article's analysis of non-gravitational acceleration
const PARADOX_DATA = [
    { time: 'Pre-perihelion', observed: 1.2, predicted: 0.8, lower: 0.3, upper: 1.5 },
    { time: 'Approach', observed: 1.8, predicted: 1.2, lower: 0.5, upper: 2.0 },
    { time: 'Perihelion', observed: 2.3, predicted: 1.5, lower: 0.8, upper: 2.5 },
    { time: 'Post-perihelion', observed: 2.1, predicted: 1.3, lower: 0.6, upper: 2.2 },
    { time: 'Exit', observed: 1.5, predicted: 0.9, lower: 0.4, upper: 1.8 },
];

/**
 * ------------------------------------------------------------------
 * COMPONENTS
 * ------------------------------------------------------------------
 */

const GlitchText = ({ text }: { text: string }) => {
    return (
        <span className="relative inline-block group">
            <span className="relative z-10">{text}</span>
            <span className="absolute top-0 left-0 -ml-0.5 text-red-500 opacity-0 group-hover:opacity-70 animate-pulse">{text}</span>
            <span className="absolute top-0 left-0 ml-0.5 text-cyan-500 opacity-0 group-hover:opacity-70 animate-pulse delay-75">{text}</span>
        </span>
    );
};

// Simulated MDX Content Component for Page 5
const ScientificChart = () => {
    return (
        <div className="w-full h-64 bg-black/40 backdrop-blur-md border border-rose-500/30 rounded-lg p-4 mt-4">
            <div className="flex justify-between items-center mb-4">
                <h4 className="text-rose-400 text-xs font-mono uppercase tracking-widest">Non-Gravitational Acceleration</h4>
                <span className="text-xs text-white/50 font-mono">FIG 5.1</span>
            </div>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={PARADOX_DATA}>
                    <defs>
                        <linearGradient id="colorObs" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1} />
                            <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="time" stroke="#475569" fontSize={10} tickLine={false} />
                    <YAxis stroke="#475569" fontSize={10} tickLine={false} label={{ value: '×10⁻⁶ m/s²', angle: -90, position: 'insideLeft', style: { fontSize: 10, fill: '#94a3b8' } }} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '12px' }}
                        itemStyle={{ color: '#e2e8f0' }}
                    />
                    <Area type="monotone" dataKey="observed" stroke="#f43f5e" fillOpacity={1} fill="url(#colorObs)" name="Observed" strokeWidth={2} />
                    <Area type="monotone" dataKey="predicted" stroke="#94a3b8" strokeDasharray="5 5" fillOpacity={1} fill="url(#colorPred)" name="Passive Model" strokeWidth={2} />
                </AreaChart>
            </ResponsiveContainer>
            <div className="text-[10px] text-rose-300 mt-2 font-mono">
                * Observed acceleration: a_ng = (2.3 ± 0.7) × 10⁻⁶ m/s² exceeds standard sublimation predictions
            </div>
        </div>
    );
};

const Navigation = ({
    current,
    total,
    onNext,
    onPrev
}: {
    current: number;
    total: number;
    onNext: () => void;
    onPrev: () => void;
}) => {
    const progress = (current / total) * 100;

    return (
        <div className="fixed bottom-0 left-0 w-full z-50 p-4 md:p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
            <div className="max-w-7xl mx-auto flex items-end justify-between">

                {/* Progress Bar & Chapter Info */}
                <div className="flex-1 mr-8">
                    <div className="flex items-center gap-4 mb-2">
                        <span className="text-xs font-mono text-cyan-500">
                            PG {current.toString().padStart(2, '0')} / {total.toString().padStart(2, '0')}
                        </span>
                        <span className="text-xs font-mono text-white/40 uppercase hidden md:inline-block">
                            {NARRATIVE_DATA[current - 1].slug}
                        </span>
                    </div>
                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                </div>

                {/* Controls */}
                <div className="flex gap-2">
                    <button
                        onClick={onPrev}
                        disabled={current === 1}
                        className={`p-3 rounded-full border border-white/20 backdrop-blur-sm transition-all
              ${current === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10 hover:border-cyan-500/50 hover:text-cyan-400 text-white'}`}
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <button
                        onClick={onNext}
                        disabled={current === total}
                        className={`p-3 rounded-full border border-white/20 backdrop-blur-sm transition-all group
              ${current === total ? 'opacity-30 cursor-not-allowed' : 'hover:bg-cyan-500/10 hover:border-cyan-500 hover:text-cyan-400 text-white'}`}
                    >
                        <ChevronRight size={24} className={current !== total ? "group-hover:translate-x-0.5 transition-transform" : ""} />
                    </button>
                </div>
            </div>
        </div>
    );
};

const BackgroundVisuals = ({ pageIndex }: { pageIndex: number }) => {
    const isHero = pageIndex === 0;

    return (
        <div className="absolute inset-0 z-0 overflow-hidden bg-black">
            {/* Base Layer - The Hero Image with Comic Book Aesthetic */}
            <motion.div
                className="absolute inset-0 w-full h-full"
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{
                    scale: isHero ? 1.05 : 1.2,
                    opacity: isHero ? 1 : 0.4,
                    filter: isHero ? 'blur(0px) contrast(1.1) saturate(1.1)' : 'blur(8px) brightness(0.5) grayscale(0.5)'
                }}
                transition={{ duration: 1.2 }}
            >
                <img
                    src={HERO_IMAGE_URL}
                    onError={(e) => {
                        e.currentTarget.src = "https://googleusercontent.com/image_generation_content/0";
                    }}
                    alt="Avra in Lab"
                    className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-cyan-900/20 mix-blend-multiply" />

                <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay"
                    style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '4px 4px' }}>
                </div>
            </motion.div>

            {/* Abstract Data Layers for other pages */}
            {!isHero && (
                <motion.div
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                    <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:50px_50px]" />

                    <div className={`absolute top-1/4 left-1/4 w-96 h-96 bg-${NARRATIVE_DATA[pageIndex].theme}-500/20 rounded-full blur-[100px] animate-pulse`} />
                    <div className={`absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]`} />
                </motion.div>
            )}
        </div>
    );
};

/**
 * ------------------------------------------------------------------
 * INTRO / LANDING PAGE COMPONENT
 * ------------------------------------------------------------------
 */
const IntroScreen = ({ onEnter }: { onEnter: () => void }) => {
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const currentVideo = INTRO_SEQUENCE[currentVideoIndex];

    const handleVideoEnd = () => {
        // Loop playlist: 0 -> 1 -> 0 ...
        setCurrentVideoIndex((prev) => (prev + 1) % INTRO_SEQUENCE.length);
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black text-white flex flex-col items-center justify-center overflow-hidden">

            {/* Background Ambience */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-black opacity-80 z-0" />
            <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />

            {/* Main Container */}
            <div className="relative z-10 w-full max-w-4xl mx-auto px-4 flex flex-col items-center">

                {/* Title */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-8"
                >
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <Atom className="text-cyan-400 animate-spin-slow" size={32} />
                        <h1 className="text-3xl md:text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
                            3i ATLAS
                        </h1>
                    </div>
                    <h2 className="text-lg md:text-2xl font-light tracking-[0.5em] text-slate-400 uppercase">
                        PARADOX
                    </h2>
                </motion.div>

                {/* Sequential Video Player */}
                <div className="w-full mb-10 relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentVideo.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1 }}
                            className="relative group rounded-xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(34,211,238,0.1)] bg-black/50 aspect-video"
                        >
                            <video
                                src={currentVideo.src}
                                className="w-full h-full object-cover"
                                autoPlay
                                muted
                                playsInline
                                onEnded={handleVideoEnd}
                            />

                            {/* Video Overlay Info */}
                            <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <motion.p
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="text-cyan-400 font-mono text-xs uppercase tracking-widest mb-1"
                                        >
                                            {currentVideo.label}
                                        </motion.p>
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                            className="text-white text-lg font-light italic"
                                        >
                                            "{currentVideo.quote}"
                                        </motion.p>
                                    </div>

                                    {/* Progress Indicator */}
                                    <div className="flex gap-1">
                                        {INTRO_SEQUENCE.map((_, idx) => (
                                            <div
                                                key={idx}
                                                className={`h-1 w-8 rounded-full transition-colors duration-300 ${idx === currentVideoIndex ? 'bg-cyan-500 shadow-[0_0_8px_cyan]' : 'bg-white/20'}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Enter Button */}
                <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    onClick={onEnter}
                    className="group relative px-12 py-4 bg-transparent overflow-hidden rounded-full cursor-pointer z-50"
                >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-cyan-500 to-blue-500 opacity-20 group-hover:opacity-40 transition-opacity blur-md"></span>
                    <span className="absolute inset-0 w-full h-full border border-cyan-500/50 rounded-full group-hover:scale-105 transition-transform duration-300"></span>
                    <div className="relative flex items-center gap-3 text-cyan-100 font-bold tracking-widest text-xl">
                        <span>ENTER EXPERIENCE</span>
                        <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                    </div>
                </motion.button>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="mt-6 text-xs text-slate-500 font-mono uppercase"
                >
                    Immersive Scientific Experience v1.0
                </motion.p>

            </div>
        </div>
    );
};

/**
 * ------------------------------------------------------------------
 * MAIN APP COMPONENT
 * ------------------------------------------------------------------
 */
export default function AtlasParadox() {
    const [page, setPage] = useState(1);
    const [direction, setDirection] = useState(0);
    const [showIntro, setShowIntro] = useState(true); // Controla a exibição da Intro

    // Simulate routing change
    const handleNext = () => {
        if (page < NARRATIVE_DATA.length) {
            setDirection(1);
            setPage(p => p + 1);
        }
    };

    const handlePrev = () => {
        if (page > 1) {
            setDirection(-1);
            setPage(p => p - 1);
        }
    };

    const currentPageData = NARRATIVE_DATA[page - 1];

    // Animation Variants
    const pageVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
        }),
    };

    return (
        <div className="relative w-full h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans selection:bg-cyan-500/30">

            {/* 0. INTRO OVERLAY */}
            <AnimatePresence>
                {showIntro && (
                    <motion.div
                        key="intro"
                        exit={{ opacity: 0, y: -50, transition: { duration: 0.8 } }}
                        className="absolute inset-0 z-[100]"
                    >
                        <IntroScreen onEnter={() => setShowIntro(false)} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 1. Global Navigation / Header */}
            <nav className="fixed top-0 left-0 w-full z-50 p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                <div className="flex items-center gap-2 pointer-events-auto cursor-pointer" onClick={() => setShowIntro(true)}>
                    <Atom className="text-cyan-400 animate-spin-slow" size={24} />
                    <span className="font-bold tracking-widest text-sm md:text-base">3i ATLAS <span className="text-slate-400 font-normal">PARADOX</span></span>
                </div>
                <div className="flex gap-4 pointer-events-auto">
                    <button className="p-2 hover:bg-white/10 rounded-full transition-colors"><Globe size={20} /></button>
                    <button className="p-2 hover:bg-white/10 rounded-full transition-colors"><Menu size={20} /></button>
                </div>
            </nav>

            {/* 2. Background Layer */}
            <BackgroundVisuals pageIndex={page - 1} />

            {/* 3. Main Content Area (The "Page") */}
            <div className="relative z-10 w-full h-full flex items-center justify-center">
                <AnimatePresence initial={false} custom={direction} mode='wait'>
                    <motion.div
                        key={page}
                        custom={direction}
                        variants={pageVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 }
                        }}
                        className="w-full max-w-7xl mx-auto px-6 grid md:grid-cols-12 gap-8 h-[70vh]"
                    >

                        {/* Left Col: Narrative Box */}
                        <div className="md:col-span-5 flex flex-col justify-center">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.6 }}
                                className="bg-black/60 backdrop-blur-xl border-l-4 border-cyan-500 p-6 md:p-10 shadow-2xl rounded-r-lg"
                            >
                                <div className="flex items-center gap-2 mb-4 text-cyan-400 text-xs font-mono tracking-widest uppercase">
                                    <Activity size={12} />
                                    <span>Log Entry: {currentPageData.slug}</span>
                                </div>

                                <h1 className="text-3xl md:text-5xl font-bold mb-2 leading-tight">
                                    <GlitchText text={currentPageData.title} />
                                </h1>
                                <h2 className={`text-xl md:text-2xl font-light text-${currentPageData.theme}-400 mb-6`}>
                                    {currentPageData.subtitle}
                                </h2>

                                <p className="text-lg text-slate-300 leading-relaxed font-serif italic border-l-2 border-white/10 pl-4">
                                    "{currentPageData.narrative}"
                                </p>

                                {/* Simulated Metadata/Tags */}
                                <div className="mt-6 flex gap-2">
                                    <span className="px-2 py-1 bg-white/5 rounded text-[10px] uppercase tracking-wider text-slate-400 border border-white/5">
                                        Astrobiology
                                    </span>
                                    <span className="px-2 py-1 bg-white/5 rounded text-[10px] uppercase tracking-wider text-slate-400 border border-white/5">
                                        Clearance: Alpha
                                    </span>
                                </div>
                            </motion.div>
                        </div>

                        {/* Right Col: Scientific/Visual Content */}
                        <div className="md:col-span-7 flex flex-col justify-center items-end relative">

                            {/* Page 5 Special: Scientific Chart */}
                            {currentPageData.id === 5 && (
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="w-full max-w-lg"
                                >
                                    <ScientificChart />
                                </motion.div>
                            )}

                            {/* Standard Scientific Overlay for other pages */}
                            {currentPageData.scientificData && currentPageData.id !== 5 && (
                                <motion.div
                                    initial={{ x: 50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="mt-4 md:mt-0 max-w-xs w-full bg-slate-900/80 backdrop-blur border border-white/10 p-4 rounded-lg"
                                >
                                    <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
                                        <span className="text-xs font-mono text-cyan-400">SENSOR DATA</span>
                                        <Database size={12} className="text-slate-500" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-400">Type</span>
                                            <span className="font-mono text-white">{currentPageData.scientificData.type}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-400">Reading</span>
                                            <span className="font-mono text-red-400 animate-pulse">{currentPageData.scientificData.value}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                        </div>

                    </motion.div>
                </AnimatePresence>
            </div>

            {/* 4. Navigation Controls */}
            <Navigation
                current={page}
                total={NARRATIVE_DATA.length}
                onNext={handleNext}
                onPrev={handlePrev}
            />

        </div>
    );
}

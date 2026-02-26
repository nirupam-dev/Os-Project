import { motion, AnimatePresence } from 'framer-motion';

/** Algorithm meta for tooltips */
const ALGO = {
    fcfs: {
        name: 'First Come First Serve',
        tag: 'FCFS',
        desc: 'Processes execute in arrival order. Simplest algorithm — no preemption.',
        pros: 'Simple, fair, no starvation',
        cons: 'Convoy effect — short jobs wait behind long ones',
        color: 'indigo',
    },
    sjf: {
        name: 'Shortest Job First',
        tag: 'SJF',
        desc: 'Among arrived processes, the shortest burst is chosen. Non-preemptive.',
        pros: 'Optimal average waiting time',
        cons: 'Starvation possible; requires burst prediction',
        color: 'purple',
    },
    rr: {
        name: 'Round Robin',
        tag: 'RR',
        desc: 'Each process gets a fixed time slice. If unfinished, it re-enters the queue.',
        pros: 'Fair, good response time, no starvation',
        cons: 'Higher avg WT; depends on quantum size',
        color: 'cyan',
    },
    priority: {
        name: 'Priority Scheduling',
        tag: 'PRI',
        desc: 'Highest priority process runs first (lower number = higher priority). Non-preemptive.',
        pros: 'Supports process importance',
        cons: 'Starvation for low-priority processes',
        color: 'emerald',
    },
};

const colorVars = {
    indigo: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/15', text: 'text-indigo-300', pill: 'bg-indigo-500 text-white' },
    purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/15', text: 'text-purple-300', pill: 'bg-purple-500 text-white' },
    cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/15', text: 'text-cyan-300', pill: 'bg-cyan-500 text-white' },
    emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/15', text: 'text-emerald-300', pill: 'bg-emerald-500 text-white' },
};

export default function AlgorithmSelector({
    algorithm, setAlgorithm, timeQuantum, setTimeQuantum, isRunning,
}) {
    const info = ALGO[algorithm];
    const cv = colorVars[info.color];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="glass-card p-5 lg:p-6 rounded-2xl"
        >
            <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-500/15 flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>
                Algorithm
            </h2>

            {/* Pill Selector */}
            <div className="grid grid-cols-4 gap-1.5 p-1 bg-white/[0.03] rounded-xl border border-white/[0.04] mb-4">
                {Object.entries(ALGO).map(([key, val]) => (
                    <motion.button
                        key={key}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => !isRunning && setAlgorithm(key)}
                        disabled={isRunning}
                        className={`relative py-2 px-1 rounded-lg text-[10px] lg:text-xs font-bold tracking-wide transition-all
                       ${algorithm === key
                                ? `${colorVars[val.color].pill} shadow-lg`
                                : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'}
                       disabled:opacity-40 disabled:cursor-not-allowed`}
                    >
                        {val.tag}
                        {algorithm === key && (
                            <motion.div
                                layoutId="algo-indicator"
                                className="absolute inset-0 rounded-lg"
                                style={{ zIndex: -1 }}
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            />
                        )}
                    </motion.button>
                ))}
            </div>

            {/* Time Quantum (RR only) */}
            <AnimatePresence>
                {algorithm === 'rr' && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mb-4"
                    >
                        <label className="block text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-2">
                            Time Quantum
                        </label>
                        <div className="flex items-center gap-3">
                            <input type="number" min="1" value={timeQuantum}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value, 10);
                                    if (!isNaN(val) && val > 0) setTimeQuantum(val);
                                }}
                                disabled={isRunning}
                                className="input-glow flex-1 px-4 py-2.5 bg-white/[0.03] border border-white/8 rounded-xl 
                           text-white font-mono font-bold text-center focus:outline-none disabled:opacity-40" />
                            <div className="text-[10px] text-gray-500 leading-tight">
                                <p>Smaller = more responsive</p>
                                <p>Larger = less overhead</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Algorithm Info Card */}
            <motion.div
                key={algorithm}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`${cv.bg} border ${cv.border} rounded-xl p-4`}
            >
                <div className="flex items-center gap-2 mb-2">
                    <h3 className={`${cv.text} font-bold text-sm`}>{info.name}</h3>
                </div>
                <p className="text-gray-400 text-[11px] leading-relaxed mb-3">{info.desc}</p>
                <div className="space-y-1.5 text-[11px]">
                    <div className="flex items-start gap-2">
                        <svg className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-300">{info.pros}</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <svg className="w-3.5 h-3.5 text-rose-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="text-gray-300">{info.cons}</span>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

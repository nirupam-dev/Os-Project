import { motion } from 'framer-motion';

/**
 * SimulationControls — Premium Start/Pause/Reset/Step buttons
 * with neon glow, step-by-step toggle, and animated progress bar.
 */
export default function SimulationControls({
    onStart, onPause, onReset, onStep,
    isRunning, isPaused, hasResults,
    isStepMode, setIsStepMode,
    currentStep, totalSteps,
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="glass-card p-5 lg:p-6 rounded-2xl"
        >
            <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                    <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                Controls
            </h2>

            <div className="space-y-4">
                {/* Buttons */}
                <div className="grid grid-cols-2 gap-2.5">
                    {/* Start / Resume */}
                    <motion.button
                        whileHover={{ scale: 1.03, y: -1 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={onStart}
                        disabled={isRunning && !isPaused}
                        className="btn-neon group flex items-center justify-center gap-2 px-4 py-3 
                       bg-gradient-to-r from-emerald-500 to-green-600 text-white 
                       rounded-xl font-bold text-xs tracking-wide shadow-lg shadow-emerald-500/20
                       hover:shadow-emerald-500/30 transition-all
                       disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-none"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                        {isPaused ? 'Resume' : 'Start'}
                    </motion.button>

                    {/* Pause */}
                    <motion.button
                        whileHover={{ scale: 1.03, y: -1 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={onPause}
                        disabled={!isRunning || isPaused}
                        className="btn-neon flex items-center justify-center gap-2 px-4 py-3 
                       bg-gradient-to-r from-amber-500 to-orange-600 text-white 
                       rounded-xl font-bold text-xs tracking-wide shadow-lg shadow-amber-500/20
                       hover:shadow-amber-500/30 transition-all
                       disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-none"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                        </svg>
                        Pause
                    </motion.button>

                    {/* Step */}
                    <motion.button
                        whileHover={{ scale: 1.03, y: -1 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={onStep}
                        disabled={!isStepMode && isRunning}
                        className="btn-neon flex items-center justify-center gap-2 px-4 py-3 
                       bg-gradient-to-r from-indigo-500 to-purple-600 text-white 
                       rounded-xl font-bold text-xs tracking-wide shadow-lg shadow-indigo-500/20
                       hover:shadow-indigo-500/30 transition-all
                       disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-none"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M5 4l10 8-10 8V4zm11 0h4v16h-4V4z" />
                        </svg>
                        Step
                    </motion.button>

                    {/* Reset */}
                    <motion.button
                        whileHover={{ scale: 1.03, y: -1 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={onReset}
                        className="btn-neon flex items-center justify-center gap-2 px-4 py-3 
                       bg-gradient-to-r from-rose-500 to-pink-600 text-white 
                       rounded-xl font-bold text-xs tracking-wide shadow-lg shadow-rose-500/20
                       hover:shadow-rose-500/30 transition-all"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Reset
                    </motion.button>
                </div>

                {/* Step-by-Step Toggle */}
                <div className="flex items-center justify-between bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-3">
                    <div>
                        <p className="text-white text-xs font-semibold">Step-by-Step Mode</p>
                        <p className="text-gray-600 text-[10px] mt-0.5">Manual control for viva demo</p>
                    </div>
                    <button
                        onClick={() => setIsStepMode(!isStepMode)}
                        disabled={isRunning}
                        className={`relative w-11 h-6 rounded-full transition-all duration-300 
                       disabled:opacity-40 disabled:cursor-not-allowed
                       ${isStepMode
                                ? 'bg-indigo-500 shadow-lg shadow-indigo-500/30'
                                : 'bg-gray-700 hover:bg-gray-600'}`}
                    >
                        <motion.span
                            layout
                            transition={{ type: 'spring', stiffness: 700, damping: 30 }}
                            className={`absolute top-0.5 w-5 h-5 rounded-full shadow-md
                         ${isStepMode ? 'bg-white left-[22px]' : 'bg-gray-400 left-[2px]'}`}
                        />
                    </button>
                </div>

                {/* Progress */}
                {hasResults && totalSteps > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-2"
                    >
                        <div className="flex justify-between text-[11px]">
                            <span className="text-gray-500 font-medium">Progress</span>
                            <span className="text-gray-400 font-mono">
                                <span className="text-white font-bold">{currentStep}</span>
                                <span className="mx-0.5 text-gray-600">/</span>
                                {totalSteps}
                            </span>
                        </div>
                        <div className="w-full bg-white/[0.04] rounded-full h-2 overflow-hidden border border-white/[0.04]">
                            <motion.div
                                className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                                transition={{ duration: 0.4, ease: 'easeOut' }}
                                style={{
                                    boxShadow: '0 0 12px rgba(99, 102, 241, 0.4)',
                                }}
                            />
                        </div>
                        {currentStep >= totalSteps && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-emerald-400 text-[11px] font-semibold flex items-center gap-1"
                            >
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                                Simulation complete
                            </motion.p>
                        )}
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}

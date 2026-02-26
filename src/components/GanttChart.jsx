import { motion } from 'framer-motion';
import { IDLE_COLOR } from '../utils/colors';

/**
 * GanttChart — Animated timeline with glow effects, smooth transitions,
 * hover tooltips, execution cursor, and professional styling.
 */
export default function GanttChart({ ganttChart, colorMap, visibleSteps }) {
    const isEmpty = !ganttChart || ganttChart.length === 0;
    const displayedChart = isEmpty ? [] : ganttChart.slice(0, visibleSteps);
    const totalTime = isEmpty ? 0 : ganttChart[ganttChart.length - 1].endTime;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="glass-card p-5 lg:p-6 rounded-2xl"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-white flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/15 flex items-center justify-center">
                        <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    Gantt Chart
                </h2>
                {displayedChart.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2 px-3 py-1 bg-white/[0.03] rounded-lg border border-white/[0.06] text-[11px] text-gray-400"
                    >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Total: <span className="font-mono font-bold text-white">{displayedChart[displayedChart.length - 1]?.endTime || 0}</span> units
                    </motion.div>
                )}
            </div>

            {/* Empty state */}
            {isEmpty && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 mb-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] 
                         flex items-center justify-center shimmer">
                        <svg className="w-8 h-8 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <p className="text-gray-500 text-sm font-medium mb-1">No simulation data</p>
                    <p className="text-gray-600 text-xs">Click "Start" to run the simulation</p>
                </div>
            )}

            {/* Gantt Timeline */}
            {displayedChart.length > 0 && (
                <div className="space-y-3">
                    {/* Timeline bar */}
                    <div className="relative overflow-x-auto pb-1">
                        <div className="flex min-w-max gap-1">
                            {displayedChart.map((block, index) => {
                                const width = ((block.endTime - block.startTime) / totalTime) * 100;
                                const isIdle = block.processId === 'Idle';
                                const color = isIdle ? IDLE_COLOR : (colorMap[block.processId] || IDLE_COLOR);

                                return (
                                    <motion.div
                                        key={`${block.processId}-${block.startTime}-${index}`}
                                        initial={{ scaleX: 0, opacity: 0 }}
                                        animate={{ scaleX: 1, opacity: 1 }}
                                        transition={{
                                            duration: 0.45,
                                            delay: index * 0.12,
                                            ease: [0.22, 1, 0.36, 1],
                                        }}
                                        className="relative group"
                                        style={{
                                            width: `${Math.max(width, 4)}%`,
                                            minWidth: '48px',
                                            transformOrigin: 'left',
                                        }}
                                    >
                                        {/* Block */}
                                        <div
                                            className={`gantt-block h-16 rounded-xl flex flex-col items-center justify-center
                                  font-bold text-sm cursor-pointer
                                  ${isIdle ? 'border border-dashed border-gray-600/50' : ''}`}
                                            style={{
                                                backgroundColor: isIdle ? 'rgba(255,255,255,0.02)' : color.bg,
                                                color: color.text,
                                                boxShadow: isIdle ? 'none' : `0 4px 20px ${color.bg}30, 0 0 40px ${color.bg}10`,
                                            }}
                                        >
                                            {isIdle ? (
                                                <span className="text-gray-600 text-xs font-medium">IDLE</span>
                                            ) : (
                                                <>
                                                    <span className="text-xs font-extrabold tracking-wide">P{block.processId}</span>
                                                    <span className="text-[9px] opacity-70 font-medium">{block.endTime - block.startTime}u</span>
                                                </>
                                            )}
                                        </div>

                                        {/* Time markers */}
                                        <div className="flex justify-between mt-1.5 px-0.5">
                                            <span className="text-[10px] text-gray-600 font-mono">{block.startTime}</span>
                                            {index === displayedChart.length - 1 && (
                                                <span className="text-[10px] text-gray-600 font-mono">{block.endTime}</span>
                                            )}
                                        </div>

                                        {/* Hover tooltip */}
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 
                                   opacity-0 group-hover:opacity-100 transition-all duration-200 
                                   pointer-events-none z-20 scale-90 group-hover:scale-100">
                                            <div className="bg-gray-900/95 border border-white/10 rounded-xl px-4 py-3 
                                    shadow-2xl backdrop-blur-sm min-w-[140px]">
                                                <p className="text-white font-bold text-sm mb-1">
                                                    {isIdle ? 'CPU Idle' : `Process P${block.processId}`}
                                                </p>
                                                <div className="space-y-0.5 text-xs text-gray-400">
                                                    <p>Start: <span className="text-white font-mono">{block.startTime}</span></p>
                                                    <p>End: <span className="text-white font-mono">{block.endTime}</span></p>
                                                    <p>Duration: <span className="text-white font-mono">{block.endTime - block.startTime}</span> units</p>
                                                </div>
                                                <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 
                                       bg-gray-900/95 rotate-45 border-r border-b border-white/10" />
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Timeline axis line */}
                    <div className="relative">
                        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        <div className="flex items-center gap-1.5 mt-2 text-[10px] text-gray-600">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                            <span className="tracking-wide uppercase font-semibold">Timeline</span>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="flex flex-wrap gap-x-4 gap-y-2 pt-3 border-t border-white/[0.04]">
                        {Object.entries(colorMap)
                            .filter(([id]) => id !== 'Idle')
                            .map(([id, color]) => (
                                <div key={id} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-200 transition-colors">
                                    <div className="w-2.5 h-2.5 rounded-full ring-1 ring-white/10"
                                        style={{ backgroundColor: color.bg }} />
                                    <span className="font-mono font-medium text-[11px]">P{id}</span>
                                </div>
                            ))}
                    </div>
                </div>
            )}
        </motion.div>
    );
}

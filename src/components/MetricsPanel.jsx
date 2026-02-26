import { motion } from 'framer-motion';

/* ─── SVG Icons for each metric ─── */
const WaitingIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const TurnaroundIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
);
const CompletionIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const ResponseIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);

export default function MetricsPanel({ results, colorMap }) {
    if (!results) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
                className="glass-card p-5 lg:p-6 rounded-2xl"
            >
                <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center">
                        <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    Performance Metrics
                </h2>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 mb-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] 
                         flex items-center justify-center shimmer">
                        <svg className="w-8 h-8 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <p className="text-gray-500 text-sm font-medium mb-1">Awaiting simulation</p>
                    <p className="text-gray-600 text-xs">Metrics populate automatically</p>
                </div>
            </motion.div>
        );
    }

    const { processResults, avgWaitingTime, avgTurnaroundTime } = results;
    const avgResponseTime = processResults.reduce((s, p) => s + p.responseTime, 0) / processResults.length;
    const avgCompletionTime = processResults.reduce((s, p) => s + p.completionTime, 0) / processResults.length;

    const cards = [
        { label: 'Avg Waiting Time', value: avgWaitingTime, icon: WaitingIcon, gradient: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-500/20' },
        { label: 'Avg Turnaround', value: avgTurnaroundTime, icon: TurnaroundIcon, gradient: 'from-indigo-500 to-purple-600', shadow: 'shadow-indigo-500/20' },
        { label: 'Avg Completion', value: avgCompletionTime, icon: CompletionIcon, gradient: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/20' },
        { label: 'Avg Response', value: avgResponseTime, icon: ResponseIcon, gradient: 'from-cyan-500 to-blue-600', shadow: 'shadow-cyan-500/20' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="glass-card p-5 lg:p-6 rounded-2xl"
        >
            <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center">
                    <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                </div>
                Performance Metrics
            </h2>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                {cards.map((card, i) => {
                    const Icon = card.icon;
                    return (
                        <motion.div
                            key={card.label}
                            initial={{ opacity: 0, scale: 0.85, y: 12 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.45, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                            className={`metric-card bg-gradient-to-br ${card.gradient} rounded-xl p-4 shadow-lg ${card.shadow}`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center text-white/90">
                                    <Icon />
                                </div>
                            </div>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 + i * 0.1 }}
                                className="text-white text-2xl lg:text-3xl font-extrabold tracking-tight"
                            >
                                {card.value.toFixed(2)}
                            </motion.p>
                            <p className="text-white/70 text-[10px] font-semibold uppercase tracking-wider mt-1">
                                {card.label}
                            </p>
                        </motion.div>
                    );
                })}
            </div>

            {/* Per-process table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-[10px] uppercase tracking-wider text-gray-500 border-b border-white/[0.06]">
                            <th className="py-3 px-3 text-left font-semibold">Process</th>
                            <th className="py-3 px-2 text-center font-semibold">AT</th>
                            <th className="py-3 px-2 text-center font-semibold">BT</th>
                            <th className="py-3 px-2 text-center font-semibold">CT</th>
                            <th className="py-3 px-2 text-center font-semibold">TAT</th>
                            <th className="py-3 px-2 text-center font-semibold">WT</th>
                            <th className="py-3 px-2 text-center font-semibold">RT</th>
                        </tr>
                    </thead>
                    <tbody>
                        {processResults.sort((a, b) => a.id - b.id).map((p, i) => {
                            const color = colorMap[p.id];
                            return (
                                <motion.tr
                                    key={p.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: 0.1 + i * 0.04 }}
                                    className="table-row-hover border-b border-white/[0.03]"
                                >
                                    <td className="py-3 px-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full ring-1 ring-white/10"
                                                style={{ backgroundColor: color?.bg || '#6366f1', boxShadow: `0 0 8px ${color?.bg || '#6366f1'}30` }} />
                                            <span className="font-mono text-xs font-bold text-indigo-300">P{p.id}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-2 text-center text-gray-400 text-xs font-mono">{p.arrivalTime}</td>
                                    <td className="py-3 px-2 text-center text-gray-400 text-xs font-mono">{p.burstTime}</td>
                                    <td className="py-3 px-2 text-center font-mono">
                                        <span className="text-emerald-400 font-bold text-xs bg-emerald-500/8 px-1.5 py-0.5 rounded">{p.completionTime}</span>
                                    </td>
                                    <td className="py-3 px-2 text-center font-mono">
                                        <span className="text-purple-400 font-bold text-xs bg-purple-500/8 px-1.5 py-0.5 rounded">{p.turnaroundTime}</span>
                                    </td>
                                    <td className="py-3 px-2 text-center font-mono">
                                        <span className="text-amber-400 font-bold text-xs bg-amber-500/8 px-1.5 py-0.5 rounded">{p.waitingTime}</span>
                                    </td>
                                    <td className="py-3 px-2 text-center font-mono">
                                        <span className="text-cyan-400 font-bold text-xs bg-cyan-500/8 px-1.5 py-0.5 rounded">{p.responseTime}</span>
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Legend */}
            <div className="mt-4 pt-3 border-t border-white/[0.04] flex flex-wrap gap-x-5 gap-y-1 text-[10px] text-gray-500">
                <span>AT = Arrival Time</span>
                <span>BT = Burst Time</span>
                <span>CT = Completion Time</span>
                <span>TAT = Turnaround Time</span>
                <span>WT = Waiting Time</span>
                <span>RT = Response Time</span>
            </div>
        </motion.div>
    );
}

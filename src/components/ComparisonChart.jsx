import { useMemo } from 'react';
import { motion } from 'framer-motion';

import { fcfs } from '../algorithms/fcfs';
import { sjf } from '../algorithms/sjf';
import { roundRobin } from '../algorithms/rr';
import { priorityScheduling } from '../algorithms/priority';

/**
 * ComparisonChart — Runs all 4 algorithms on the same input and
 * displays an animated bar chart comparing Avg Waiting Time and
 * Avg Turnaround Time side-by-side.
 */

const ALGORITHMS = [
    { key: 'fcfs', name: 'FCFS', color: '#6366f1', lightColor: '#818cf8' },
    { key: 'sjf', name: 'SJF', color: '#a855f7', lightColor: '#c084fc' },
    { key: 'rr', name: 'RR', color: '#06b6d4', lightColor: '#22d3ee' },
    { key: 'priority', name: 'Priority', color: '#10b981', lightColor: '#34d399' },
];

export default function ComparisonChart({ processes, timeQuantum, onClose }) {
    // Run all 4 algorithms on the same process input
    const comparison = useMemo(() => {
        if (!processes || processes.length === 0) return null;

        const results = {};
        try {
            results.fcfs = fcfs(processes);
            results.sjf = sjf(processes);
            results.rr = roundRobin(processes, timeQuantum);
            results.priority = priorityScheduling(processes);
        } catch {
            return null;
        }

        return ALGORITHMS.map(algo => ({
            ...algo,
            avgWT: results[algo.key].avgWaitingTime,
            avgTAT: results[algo.key].avgTurnaroundTime,
        }));
    }, [processes, timeQuantum]);

    if (!comparison) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6 rounded-2xl text-center text-gray-500 text-sm py-12"
            >
                Add at least one process to compare algorithms.
            </motion.div>
        );
    }

    // Find max values for scaling bars
    const maxWT = Math.max(...comparison.map(c => c.avgWT), 0.01);
    const maxTAT = Math.max(...comparison.map(c => c.avgTAT), 0.01);
    const globalMax = Math.max(maxWT, maxTAT);

    // Helper to find best (lowest) value
    const bestWT = Math.min(...comparison.map(c => c.avgWT));
    const bestTAT = Math.min(...comparison.map(c => c.avgTAT));

    return (
        <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="glass-card p-5 lg:p-6 rounded-2xl"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center">
                        <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    Algorithm Comparison
                </h2>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center 
                     justify-center text-gray-500 hover:text-white hover:bg-white/[0.08] transition-all"
                >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </motion.button>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Average Waiting Time Chart */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-sm font-semibold text-gray-300">Average Waiting Time</h3>
                    </div>
                    <div className="space-y-3">
                        {comparison.map((algo, i) => (
                            <motion.div
                                key={algo.key}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1, duration: 0.4 }}
                                className="group"
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-bold text-gray-400 group-hover:text-white transition-colors">
                                        {algo.name}
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-xs font-mono font-bold text-white">
                                            {algo.avgWT.toFixed(2)}
                                        </span>
                                        {algo.avgWT === bestWT && (
                                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                                                BEST
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="w-full bg-white/[0.04] rounded-full h-3 overflow-hidden border border-white/[0.04]">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(algo.avgWT / globalMax) * 100}%` }}
                                        transition={{ delay: 0.2 + i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                        className="h-full rounded-full relative"
                                        style={{
                                            background: `linear-gradient(90deg, ${algo.color}, ${algo.lightColor})`,
                                            boxShadow: `0 0 12px ${algo.color}40`,
                                            minWidth: algo.avgWT > 0 ? '8px' : '0px',
                                        }}
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Average Turnaround Time Chart */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <h3 className="text-sm font-semibold text-gray-300">Average Turnaround Time</h3>
                    </div>
                    <div className="space-y-3">
                        {comparison.map((algo, i) => (
                            <motion.div
                                key={algo.key}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                                className="group"
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-bold text-gray-400 group-hover:text-white transition-colors">
                                        {algo.name}
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-xs font-mono font-bold text-white">
                                            {algo.avgTAT.toFixed(2)}
                                        </span>
                                        {algo.avgTAT === bestTAT && (
                                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                                                BEST
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="w-full bg-white/[0.04] rounded-full h-3 overflow-hidden border border-white/[0.04]">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(algo.avgTAT / globalMax) * 100}%` }}
                                        transition={{ delay: 0.5 + i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                        className="h-full rounded-full"
                                        style={{
                                            background: `linear-gradient(90deg, ${algo.color}, ${algo.lightColor})`,
                                            boxShadow: `0 0 12px ${algo.color}40`,
                                            minWidth: algo.avgTAT > 0 ? '8px' : '0px',
                                        }}
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Summary Table */}
            <div className="mt-6 pt-5 border-t border-white/[0.04]">
                <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="text-[10px] uppercase tracking-wider text-gray-500 border-b border-white/[0.06]">
                                <th className="py-2.5 px-3 text-left font-semibold">Algorithm</th>
                                <th className="py-2.5 px-3 text-center font-semibold">Avg WT</th>
                                <th className="py-2.5 px-3 text-center font-semibold">Avg TAT</th>
                                <th className="py-2.5 px-3 text-center font-semibold">Avg RT</th>
                                <th className="py-2.5 px-3 text-center font-semibold">Ranking</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[...comparison]
                                .sort((a, b) => a.avgWT - b.avgWT)
                                .map((algo, i) => {
                                    // Compute Avg RT from full results
                                    let avgRT = 0;
                                    try {
                                        let r;
                                        switch (algo.key) {
                                            case 'fcfs': r = fcfs(processes); break;
                                            case 'sjf': r = sjf(processes); break;
                                            case 'rr': r = roundRobin(processes, timeQuantum); break;
                                            default: r = priorityScheduling(processes);
                                        }
                                        avgRT = r.processResults.reduce((s, p) => s + p.responseTime, 0) / r.processResults.length;
                                    } catch { /* ignore */ }

                                    return (
                                        <motion.tr
                                            key={algo.key}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.6 + i * 0.05 }}
                                            className="table-row-hover border-b border-white/[0.03]"
                                        >
                                            <td className="py-2.5 px-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: algo.color }} />
                                                    <span className="font-bold text-gray-300">{algo.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-2.5 px-3 text-center font-mono">
                                                <span className={`font-bold px-1.5 py-0.5 rounded text-xs
                          ${algo.avgWT === bestWT ? 'text-emerald-400 bg-emerald-500/10' : 'text-gray-300'}`}>
                                                    {algo.avgWT.toFixed(2)}
                                                </span>
                                            </td>
                                            <td className="py-2.5 px-3 text-center font-mono">
                                                <span className={`font-bold px-1.5 py-0.5 rounded text-xs
                          ${algo.avgTAT === bestTAT ? 'text-emerald-400 bg-emerald-500/10' : 'text-gray-300'}`}>
                                                    {algo.avgTAT.toFixed(2)}
                                                </span>
                                            </td>
                                            <td className="py-2.5 px-3 text-center font-mono text-gray-400">
                                                {avgRT.toFixed(2)}
                                            </td>
                                            <td className="py-2.5 px-3 text-center">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full
                          ${i === 0 ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20' : 'text-gray-500'}`}>
                                                    #{i + 1}
                                                </span>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Footer note */}
            <p className="mt-3 text-[10px] text-gray-600 text-center">
                Rankings ranked by Average Waiting Time • RR uses Time Quantum = {timeQuantum}
            </p>
        </motion.div>
    );
}

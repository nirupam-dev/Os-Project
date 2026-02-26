import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getProcessColor } from '../utils/colors';

/**
 * ProcessInputTable — Premium dynamic table with row hover glow,
 * animated additions/removals, and input focus effects.
 */
export default function ProcessInputTable({ processes, setProcesses, isRunning }) {
    const [error, setError] = useState('');

    const addProcess = () => {
        const newId = processes.length > 0 ? Math.max(...processes.map(p => p.id)) + 1 : 1;
        setProcesses([...processes, { id: newId, arrivalTime: 0, burstTime: 1, priority: 0 }]);
        setError('');
    };

    const removeProcess = (id) => {
        setProcesses(processes.filter(p => p.id !== id));
        setError('');
    };

    const updateProcess = (id, field, value) => {
        const numVal = parseInt(value, 10);
        if (value !== '' && (isNaN(numVal) || numVal < 0)) {
            setError(`${field} must be a non-negative integer`);
            return;
        }
        if (field === 'burstTime' && numVal === 0) {
            setError('Burst Time must be greater than 0');
            return;
        }
        setError('');
        setProcesses(processes.map(p => p.id === id ? { ...p, [field]: value === '' ? 0 : numVal } : p));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="glass-card p-5 lg:p-6 rounded-2xl"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-white flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center">
                        <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    Process Table
                </h2>
                <motion.button
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={addProcess}
                    disabled={isRunning}
                    className="btn-neon px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white 
                     rounded-xl font-semibold text-xs tracking-wide shadow-lg shadow-indigo-500/20
                     disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    + Add Process
                </motion.button>
            </div>

            {/* Error */}
            <AnimatePresence>
                {error && (
                    <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-rose-400 text-xs mb-3 bg-rose-500/8 px-3 py-2 rounded-lg border border-rose-500/10"
                    >
                        ⚠ {error}
                    </motion.p>
                )}
            </AnimatePresence>

            {/* Table */}
            <div className="overflow-x-auto -mx-1">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-[11px] uppercase tracking-wider text-gray-500 border-b border-white/5">
                            <th className="py-2.5 px-2 text-left font-semibold w-8"></th>
                            <th className="py-2.5 px-2 text-left font-semibold">PID</th>
                            <th className="py-2.5 px-2 text-center font-semibold">Arrival</th>
                            <th className="py-2.5 px-2 text-center font-semibold">Burst</th>
                            <th className="py-2.5 px-2 text-center font-semibold">Priority</th>
                            <th className="py-2.5 px-2 w-8"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {processes.map((p, index) => {
                                const color = getProcessColor(index);
                                return (
                                    <motion.tr
                                        key={p.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20, height: 0 }}
                                        transition={{ duration: 0.3, ease: 'easeOut' }}
                                        className="table-row-hover border-b border-white/[0.03]"
                                    >
                                        <td className="py-2.5 px-2">
                                            <div
                                                className="w-4 h-4 rounded-full ring-2 ring-white/10"
                                                style={{ backgroundColor: color.bg, boxShadow: `0 0 10px ${color.bg}40` }}
                                            />
                                        </td>
                                        <td className="py-2.5 px-2">
                                            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-white/5 text-indigo-300">
                                                P{p.id}
                                            </span>
                                        </td>
                                        <td className="py-2.5 px-2">
                                            <input type="number" min="0" value={p.arrivalTime}
                                                onChange={(e) => updateProcess(p.id, 'arrivalTime', e.target.value)}
                                                disabled={isRunning}
                                                className="input-glow w-16 px-2.5 py-1.5 bg-white/[0.03] border border-white/8 rounded-lg 
                                   text-white text-center text-xs focus:outline-none disabled:opacity-40" />
                                        </td>
                                        <td className="py-2.5 px-2">
                                            <input type="number" min="1" value={p.burstTime}
                                                onChange={(e) => updateProcess(p.id, 'burstTime', e.target.value)}
                                                disabled={isRunning}
                                                className="input-glow w-16 px-2.5 py-1.5 bg-white/[0.03] border border-white/8 rounded-lg 
                                   text-white text-center text-xs focus:outline-none disabled:opacity-40" />
                                        </td>
                                        <td className="py-2.5 px-2">
                                            <input type="number" min="0" value={p.priority}
                                                onChange={(e) => updateProcess(p.id, 'priority', e.target.value)}
                                                disabled={isRunning}
                                                className="input-glow w-16 px-2.5 py-1.5 bg-white/[0.03] border border-white/8 rounded-lg 
                                   text-white text-center text-xs focus:outline-none disabled:opacity-40" />
                                        </td>
                                        <td className="py-2.5 px-2 text-right">
                                            <motion.button whileHover={{ scale: 1.15, rotate: 90 }} whileTap={{ scale: 0.85 }}
                                                onClick={() => removeProcess(p.id)} disabled={isRunning}
                                                className="w-6 h-6 rounded-md flex items-center justify-center text-gray-500 
                                   hover:text-rose-400 hover:bg-rose-500/10 transition-colors
                                   disabled:opacity-40 disabled:cursor-not-allowed text-xs">
                                                ✕
                                            </motion.button>
                                        </td>
                                    </motion.tr>
                                );
                            })}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>

            {processes.length === 0 && (
                <div className="text-center py-10">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-white/[0.03] flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </div>
                    <p className="text-gray-600 text-xs">No processes added yet</p>
                </div>
            )}

            {/* Process count badge */}
            {processes.length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/[0.04] flex items-center justify-between">
                    <span className="text-[11px] text-gray-500 tracking-wide">
                        {processes.length} process{processes.length > 1 ? 'es' : ''} configured
                    </span>
                    <div className="flex -space-x-1">
                        {processes.slice(0, 6).map((p, i) => (
                            <div key={p.id} className="w-3 h-3 rounded-full border border-[#0a0a1a]"
                                style={{ backgroundColor: getProcessColor(i).bg }} />
                        ))}
                        {processes.length > 6 && (
                            <div className="w-3 h-3 rounded-full bg-gray-700 border border-[#0a0a1a] flex items-center justify-center text-[6px] text-gray-400">
                                +{processes.length - 6}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </motion.div>
    );
}

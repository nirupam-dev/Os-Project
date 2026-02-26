/**
 * Curated vibrant color palette for process visualization.
 * Each process gets a unique color for the Gantt chart and metrics.
 */
export const PROCESS_COLORS = [
    { bg: '#6366f1', text: '#fff', name: 'Indigo' },     // Indigo
    { bg: '#f43f5e', text: '#fff', name: 'Rose' },       // Rose
    { bg: '#10b981', text: '#fff', name: 'Emerald' },    // Emerald
    { bg: '#f59e0b', text: '#000', name: 'Amber' },      // Amber
    { bg: '#8b5cf6', text: '#fff', name: 'Violet' },     // Violet
    { bg: '#06b6d4', text: '#000', name: 'Cyan' },       // Cyan
    { bg: '#ec4899', text: '#fff', name: 'Pink' },       // Pink
    { bg: '#14b8a6', text: '#000', name: 'Teal' },       // Teal
    { bg: '#ef4444', text: '#fff', name: 'Red' },        // Red
    { bg: '#3b82f6', text: '#fff', name: 'Blue' },       // Blue
    { bg: '#a855f7', text: '#fff', name: 'Purple' },     // Purple
    { bg: '#22c55e', text: '#000', name: 'Green' },      // Green
];

/** Idle block color */
export const IDLE_COLOR = { bg: '#374151', text: '#9ca3af', name: 'Idle' };

/**
 * Get color for a process by its index.
 * Wraps around if more processes than colors.
 */
export function getProcessColor(processIndex) {
    return PROCESS_COLORS[processIndex % PROCESS_COLORS.length];
}

/**
 * Build a mapping from process ID → color for quick lookup.
 */
export function buildColorMap(processes) {
    const map = {};
    processes.forEach((p, i) => {
        map[p.id] = PROCESS_COLORS[i % PROCESS_COLORS.length];
    });
    map['Idle'] = IDLE_COLOR;
    return map;
}

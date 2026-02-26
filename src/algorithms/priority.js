/**
 * Priority Scheduling (Non-Preemptive) Algorithm
 * 
 * Logic: Among all processes that have arrived, pick the one with
 * the highest priority (lowest priority number). Execute it fully
 * before selecting the next process.
 * 
 * @param {Array} processes - Array of { id, arrivalTime, burstTime, priority }
 * @returns {{ ganttChart: Array, processResults: Array, avgWaitingTime: number, avgTurnaroundTime: number }}
 */
export function priorityScheduling(processes) {
    const remaining = [...processes].map(p => ({ ...p }));
    const ganttChart = [];
    const processResults = [];
    let currentTime = 0;
    const completed = new Set();

    while (completed.size < processes.length) {
        // Find all arrived and not-completed processes
        const available = remaining.filter(
            p => p.arrivalTime <= currentTime && !completed.has(p.id)
        );

        if (available.length === 0) {
            // CPU is idle — jump to the next arriving process
            const nextArrival = remaining
                .filter(p => !completed.has(p.id))
                .reduce((min, p) => Math.min(min, p.arrivalTime), Infinity);

            ganttChart.push({
                processId: 'Idle',
                startTime: currentTime,
                endTime: nextArrival,
            });
            currentTime = nextArrival;
            continue;
        }

        // Pick process with highest priority (lowest number)
        // Tie-break: earlier arrival, then lower ID
        available.sort((a, b) => {
            if (a.priority !== b.priority) return a.priority - b.priority;
            if (a.arrivalTime !== b.arrivalTime) return a.arrivalTime - b.arrivalTime;
            return a.id - b.id;
        });

        const chosen = available[0];
        const startTime = currentTime;
        const endTime = startTime + chosen.burstTime;

        ganttChart.push({
            processId: chosen.id,
            startTime,
            endTime,
        });

        const completionTime = endTime;
        const turnaroundTime = completionTime - chosen.arrivalTime;
        const waitingTime = turnaroundTime - chosen.burstTime;
        const responseTime = startTime - chosen.arrivalTime;

        processResults.push({
            id: chosen.id,
            arrivalTime: chosen.arrivalTime,
            burstTime: chosen.burstTime,
            priority: chosen.priority,
            completionTime,
            turnaroundTime,
            waitingTime,
            responseTime,
        });

        completed.add(chosen.id);
        currentTime = endTime;
    }

    const avgWaitingTime =
        processResults.reduce((sum, p) => sum + p.waitingTime, 0) / processResults.length;
    const avgTurnaroundTime =
        processResults.reduce((sum, p) => sum + p.turnaroundTime, 0) / processResults.length;

    return { ganttChart, processResults, avgWaitingTime, avgTurnaroundTime };
}

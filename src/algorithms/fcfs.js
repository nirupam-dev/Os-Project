/**
 * FCFS (First Come First Serve) Scheduling Algorithm
 * 
 * Logic: Processes are executed in the order they arrive.
 * Sort by arrival time, then execute one after another.
 * 
 * @param {Array} processes - Array of { id, arrivalTime, burstTime, priority }
 * @returns {{ ganttChart: Array, processResults: Array, avgWaitingTime: number, avgTurnaroundTime: number }}
 */
export function fcfs(processes) {
    // Sort by arrival time, then by process ID for tie-breaking
    const sorted = [...processes].sort((a, b) => {
        if (a.arrivalTime !== b.arrivalTime) return a.arrivalTime - b.arrivalTime;
        return a.id - b.id;
    });

    const ganttChart = [];
    const processResults = [];
    let currentTime = 0;

    for (const process of sorted) {
        // If CPU is idle, jump to the next process's arrival
        if (currentTime < process.arrivalTime) {
            ganttChart.push({
                processId: 'Idle',
                startTime: currentTime,
                endTime: process.arrivalTime,
            });
            currentTime = process.arrivalTime;
        }

        const startTime = currentTime;
        const endTime = startTime + process.burstTime;

        ganttChart.push({
            processId: process.id,
            startTime,
            endTime,
        });

        const completionTime = endTime;
        const turnaroundTime = completionTime - process.arrivalTime;
        const waitingTime = turnaroundTime - process.burstTime;
        const responseTime = startTime - process.arrivalTime;

        processResults.push({
            id: process.id,
            arrivalTime: process.arrivalTime,
            burstTime: process.burstTime,
            priority: process.priority,
            completionTime,
            turnaroundTime,
            waitingTime,
            responseTime,
        });

        currentTime = endTime;
    }

    const avgWaitingTime =
        processResults.reduce((sum, p) => sum + p.waitingTime, 0) / processResults.length;
    const avgTurnaroundTime =
        processResults.reduce((sum, p) => sum + p.turnaroundTime, 0) / processResults.length;

    return { ganttChart, processResults, avgWaitingTime, avgTurnaroundTime };
}

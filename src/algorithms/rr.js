/**
 * Round Robin Scheduling Algorithm
 * 
 * Logic: Each process gets a fixed time slice (quantum). If it doesn't
 * finish within the quantum, it goes to the back of the ready queue.
 * Processes are served in FIFO order.
 * 
 * @param {Array} processes - Array of { id, arrivalTime, burstTime, priority }
 * @param {number} timeQuantum - Time quantum for each round
 * @returns {{ ganttChart: Array, processResults: Array, avgWaitingTime: number, avgTurnaroundTime: number }}
 */
export function roundRobin(processes, timeQuantum = 2) {
    // Create working copies with remaining burst time
    const remaining = processes.map(p => ({
        ...p,
        remainingTime: p.burstTime,
        firstResponse: -1,
    }));

    // Sort by arrival time initially
    remaining.sort((a, b) => {
        if (a.arrivalTime !== b.arrivalTime) return a.arrivalTime - b.arrivalTime;
        return a.id - b.id;
    });

    const ganttChart = [];
    const processResults = [];
    const readyQueue = [];
    let currentTime = 0;
    let completed = 0;
    const n = remaining.length;
    const inQueue = new Set();

    // Add processes that arrive at time 0
    for (const p of remaining) {
        if (p.arrivalTime <= currentTime) {
            readyQueue.push(p);
            inQueue.add(p.id);
        }
    }

    while (completed < n) {
        if (readyQueue.length === 0) {
            // CPU idle — find next arriving process
            const nextArrival = remaining
                .filter(p => p.remainingTime > 0 && !inQueue.has(p.id))
                .reduce((min, p) => Math.min(min, p.arrivalTime), Infinity);

            ganttChart.push({
                processId: 'Idle',
                startTime: currentTime,
                endTime: nextArrival,
            });
            currentTime = nextArrival;

            // Add newly arrived processes
            for (const p of remaining) {
                if (p.arrivalTime <= currentTime && p.remainingTime > 0 && !inQueue.has(p.id)) {
                    readyQueue.push(p);
                    inQueue.add(p.id);
                }
            }
            continue;
        }

        const current = readyQueue.shift();

        // Record first response time
        if (current.firstResponse === -1) {
            current.firstResponse = currentTime;
        }

        // Execute for min(quantum, remaining time)
        const execTime = Math.min(timeQuantum, current.remainingTime);
        const startTime = currentTime;
        const endTime = startTime + execTime;

        ganttChart.push({
            processId: current.id,
            startTime,
            endTime,
        });

        current.remainingTime -= execTime;
        currentTime = endTime;

        // Add any new processes that arrived during this execution
        for (const p of remaining) {
            if (
                p.arrivalTime > startTime &&
                p.arrivalTime <= currentTime &&
                p.remainingTime > 0 &&
                !inQueue.has(p.id)
            ) {
                readyQueue.push(p);
                inQueue.add(p.id);
            }
        }

        if (current.remainingTime > 0) {
            // Not done — put back in the queue
            readyQueue.push(current);
        } else {
            // Process completed
            completed++;
            const completionTime = currentTime;
            const turnaroundTime = completionTime - current.arrivalTime;
            const waitingTime = turnaroundTime - current.burstTime;
            const responseTime = current.firstResponse - current.arrivalTime;

            processResults.push({
                id: current.id,
                arrivalTime: current.arrivalTime,
                burstTime: current.burstTime,
                priority: current.priority,
                completionTime,
                turnaroundTime,
                waitingTime,
                responseTime,
            });
        }
    }

    // Sort results by process ID for consistent display
    processResults.sort((a, b) => a.id - b.id);

    const avgWaitingTime =
        processResults.reduce((sum, p) => sum + p.waitingTime, 0) / processResults.length;
    const avgTurnaroundTime =
        processResults.reduce((sum, p) => sum + p.turnaroundTime, 0) / processResults.length;

    return { ganttChart, processResults, avgWaitingTime, avgTurnaroundTime };
}

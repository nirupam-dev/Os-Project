/**
 * Validation helpers for process input.
 */

/**
 * Validate a single process object.
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateProcess(process) {
    const errors = [];

    if (process.arrivalTime < 0 || !Number.isFinite(process.arrivalTime)) {
        errors.push('Arrival Time must be a non-negative number');
    }
    if (process.burstTime <= 0 || !Number.isFinite(process.burstTime)) {
        errors.push('Burst Time must be a positive number');
    }
    if (process.priority < 0 || !Number.isFinite(process.priority)) {
        errors.push('Priority must be a non-negative number');
    }

    return { valid: errors.length === 0, errors };
}

/**
 * Validate the time quantum for Round Robin.
 * @returns {{ valid: boolean, error: string | null }}
 */
export function validateTimeQuantum(quantum) {
    if (quantum <= 0 || !Number.isFinite(quantum)) {
        return { valid: false, error: 'Time Quantum must be a positive number' };
    }
    return { valid: true, error: null };
}

/**
 * Validate entire process list before simulation.
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateProcessList(processes) {
    if (!processes || processes.length === 0) {
        return { valid: false, errors: ['Add at least one process to simulate'] };
    }

    const allErrors = [];
    processes.forEach((p, i) => {
        const { errors } = validateProcess(p);
        errors.forEach(e => allErrors.push(`P${p.id}: ${e}`));
    });

    return { valid: allErrors.length === 0, errors: allErrors };
}

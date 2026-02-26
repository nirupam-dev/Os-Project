import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import ProcessInputTable from './components/ProcessInputTable';
import AlgorithmSelector from './components/AlgorithmSelector';
import GanttChart from './components/GanttChart';
import MetricsPanel from './components/MetricsPanel';
import SimulationControls from './components/SimulationControls';
import ComparisonChart from './components/ComparisonChart';

// Algorithms
import { fcfs } from './algorithms/fcfs';
import { sjf } from './algorithms/sjf';
import { roundRobin } from './algorithms/rr';
import { priorityScheduling } from './algorithms/priority';

// Utilities
import { buildColorMap } from './utils/colors';
import { validateProcessList, validateTimeQuantum } from './utils/validators';

/* ─── page-level animation orchestration ─── */
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function App() {
  /* ─── state ─── */
  const [processes, setProcesses] = useState([
    { id: 1, arrivalTime: 0, burstTime: 5, priority: 2 },
    { id: 2, arrivalTime: 1, burstTime: 3, priority: 1 },
    { id: 3, arrivalTime: 2, burstTime: 8, priority: 3 },
    { id: 4, arrivalTime: 3, burstTime: 2, priority: 4 },
  ]);
  const [algorithm, setAlgorithm] = useState('fcfs');
  const [timeQuantum, setTimeQuantum] = useState(2);
  const [results, setResults] = useState(null);
  const [colorMap, setColorMap] = useState({});
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isStepMode, setIsStepMode] = useState(false);
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [error, setError] = useState('');
  const [showComparison, setShowComparison] = useState(false);
  const timerRef = useRef(null);
  const totalStepsRef = useRef(0);

  /* ─── run algorithm ─── */
  const runAlgorithm = useCallback(() => {
    const { valid, errors } = validateProcessList(processes);
    if (!valid) { setError(errors.join('; ')); return null; }
    if (algorithm === 'rr') {
      const qr = validateTimeQuantum(timeQuantum);
      if (!qr.valid) { setError(qr.error); return null; }
    }
    setError('');
    switch (algorithm) {
      case 'sjf': return sjf(processes);
      case 'rr': return roundRobin(processes, timeQuantum);
      case 'priority': return priorityScheduling(processes);
      default: return fcfs(processes);
    }
  }, [processes, algorithm, timeQuantum]);

  /* ─── simulation controls ─── */
  const handleStart = useCallback(() => {
    if (isPaused) {
      setIsPaused(false);
      if (!isStepMode) {
        timerRef.current = setInterval(() => {
          setVisibleSteps(prev => {
            if (prev >= totalStepsRef.current) { clearInterval(timerRef.current); setIsRunning(false); return prev; }
            return prev + 1;
          });
        }, 600);
      }
      return;
    }
    const result = runAlgorithm();
    if (!result) return;
    setResults(result);
    setColorMap(buildColorMap(processes));
    totalStepsRef.current = result.ganttChart.length;
    setIsRunning(true);
    setIsPaused(false);
    if (isStepMode) { setVisibleSteps(1); }
    else {
      setVisibleSteps(0);
      let step = 0;
      timerRef.current = setInterval(() => {
        step++;
        setVisibleSteps(step);
        if (step >= result.ganttChart.length) { clearInterval(timerRef.current); setIsRunning(false); }
      }, 600);
    }
  }, [isPaused, isStepMode, runAlgorithm, processes]);

  const handlePause = useCallback(() => { clearInterval(timerRef.current); setIsPaused(true); }, []);

  const handleReset = useCallback(() => {
    clearInterval(timerRef.current);
    setResults(null); setColorMap({}); setVisibleSteps(0);
    setIsRunning(false); setIsPaused(false); setError('');
    totalStepsRef.current = 0;
  }, []);

  const handleStep = useCallback(() => {
    if (!results) {
      const result = runAlgorithm();
      if (!result) return;
      setResults(result); setColorMap(buildColorMap(processes));
      totalStepsRef.current = result.ganttChart.length;
      setIsRunning(true); setIsStepMode(true); setVisibleSteps(1);
      return;
    }
    setVisibleSteps(prev => {
      const next = prev + 1;
      if (next >= totalStepsRef.current) setIsRunning(false);
      return Math.min(next, totalStepsRef.current);
    });
  }, [results, runAlgorithm, processes]);

  useEffect(() => () => clearInterval(timerRef.current), []);

  /* ─── render ─── */
  return (
    <div className="min-h-screen text-white relative">
      {/* Animated mesh gradient background */}
      <div className="mesh-gradient">
        <div className="mesh-gradient-extra" />
      </div>

      {/* Subtle grid pattern overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[1] opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Main content */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10"
      >
        {/* ──── Header ──── */}
        <motion.header variants={fadeUp} className="text-center mb-10 lg:mb-14">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="inline-flex items-center gap-2.5 px-5 py-2 bg-indigo-500/8 
                       border border-indigo-500/15 rounded-full text-indigo-300 text-xs 
                       font-semibold tracking-wide uppercase mb-5"
          >
            <span className="w-2 h-2 bg-emerald-400 rounded-full pulse-dot" />
            Operating Systems Simulator
          </motion.div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
            <span className="bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
              CPU Scheduling
            </span>
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Simulator
            </span>
          </h1>

          <p className="text-gray-400 max-w-2xl mx-auto text-sm lg:text-base leading-relaxed">
            Interactive visualization of CPU scheduling algorithms —
            <span className="text-indigo-300 font-medium"> FCFS</span>,
            <span className="text-purple-300 font-medium"> SJF</span>,
            <span className="text-cyan-300 font-medium"> Round Robin</span> &
            <span className="text-emerald-300 font-medium"> Priority Scheduling</span>
          </p>

          <div className="section-divider max-w-xs mx-auto mt-8" />

          {/* Compare All button */}
          <motion.button
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowComparison(!showComparison)}
            className={`mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold
                       tracking-wide transition-all border
                       ${showComparison
                ? 'bg-violet-500 border-violet-400 text-white shadow-lg shadow-violet-500/25'
                : 'bg-white/[0.04] border-white/[0.08] text-gray-300 hover:border-violet-500/30 hover:text-white'}`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            {showComparison ? 'Hide Comparison' : 'Compare All Algorithms'}
          </motion.button>
        </motion.header>

        {/* ──── Error Banner ──── */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              className="mb-6 bg-rose-500/8 border border-rose-500/20 rounded-2xl px-5 py-3.5 
                         text-rose-300 text-sm flex items-center gap-3 backdrop-blur-sm"
            >
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ──── Dashboard Grid ──── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6">
          {/* Left Column */}
          <motion.div variants={fadeUp} className="lg:col-span-4 xl:col-span-4 space-y-5">
            <ProcessInputTable processes={processes} setProcesses={setProcesses} isRunning={isRunning} />
            <AlgorithmSelector algorithm={algorithm} setAlgorithm={setAlgorithm}
              timeQuantum={timeQuantum} setTimeQuantum={setTimeQuantum} isRunning={isRunning} />
            <SimulationControls onStart={handleStart} onPause={handlePause} onReset={handleReset}
              onStep={handleStep} isRunning={isRunning} isPaused={isPaused} hasResults={!!results}
              isStepMode={isStepMode} setIsStepMode={setIsStepMode}
              currentStep={visibleSteps} totalSteps={totalStepsRef.current} />
          </motion.div>

          {/* Right Column */}
          <motion.div variants={fadeUp} className="lg:col-span-8 xl:col-span-8 space-y-5">
            <GanttChart ganttChart={results?.ganttChart || []} colorMap={colorMap} visibleSteps={visibleSteps} />
            <MetricsPanel results={results} colorMap={colorMap} />
          </motion.div>
        </div>

        {/* ──── Comparison Chart ──── */}
        <AnimatePresence>
          {showComparison && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: 20 }}
              className="mt-6"
            >
              <ComparisonChart
                processes={processes}
                timeQuantum={timeQuantum}
                onClose={() => setShowComparison(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ──── Footer ──── */}
        <motion.footer variants={fadeUp} className="text-center mt-12 lg:mt-16 space-y-2">
          <div className="section-divider max-w-xs mx-auto mb-5" />
          <p className="text-gray-600 text-xs tracking-wide">
            CPU Scheduling Simulator • OS Lab Project • React + Vite + Tailwind CSS + Framer Motion
          </p>
        </motion.footer>
      </motion.div>
    </div>
  );
}


'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    generatePuzzle,
    solveGenerator,
    SudokuGrid,
    createEmptyGrid,
    countRowEntropy,
    countColEntropy,
    Step
} from './SudokuEngine';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

const App: React.FC = () => {
    const [grid, setGrid] = useState<SudokuGrid>(createEmptyGrid());
    const [fixed, setFixed] = useState<boolean[][]>(Array(9).fill(null).map(() => Array(9).fill(false)));
    const [isSolving, setIsSolving] = useState(false);
    const [speed, setSpeed] = useState(250); // Balanced default speed
    const [history, setHistory] = useState<{ step: number; entropy: number }[]>([]);
    const [currentStepCount, setCurrentStepCount] = useState(0);

    const solverRef = useRef<Generator<Step> | null>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const calculateTotalEntropy = (currentGrid: SudokuGrid) => {
        let total = 0;
        for (let i = 0; i < 9; i++) {
            total += countRowEntropy(currentGrid, i);
            total += countColEntropy(currentGrid, i);
        }
        return total;
    };

    const handleGenerate = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsSolving(false);
        const { puzzle } = generatePuzzle(45);
        const newFixed = puzzle.map(row => row.map(cell => cell !== 0));
        setGrid(puzzle);
        setFixed(newFixed);
        setHistory([{ step: 0, entropy: calculateTotalEntropy(puzzle) }]);
        setCurrentStepCount(0);
    };

    const runStep = useCallback(() => {
        if (!solverRef.current) return;
        const { value, done } = solverRef.current.next();

        if (done) {
            setIsSolving(false);
            if (timerRef.current) clearInterval(timerRef.current);
            return;
        }

        const stepData = value as Step;
        setGrid(stepData.grid);
        setCurrentStepCount(prev => {
            const nextStep = prev + 1;
            const entropy = calculateTotalEntropy(stepData.grid);
            setHistory(h => {
                // Keep a larger buffer for the chart to see convergence over time
                const newHistory = [...h, { step: nextStep, entropy }];
                return newHistory.length > 200 ? newHistory.slice(1) : newHistory;
            });
            return nextStep;
        });
    }, []);

    const handleStartSolve = () => {
        if (isSolving) return;

        // Initializing visual state: Fill all non-fixed cells with '1'
        const initialSolvingGrid = grid.map((row, rIdx) =>
            row.map((cell, cIdx) => (fixed[rIdx][cIdx] ? cell : 1))
        );

        setGrid(initialSolvingGrid);
        const initialEntropy = calculateTotalEntropy(initialSolvingGrid);
        setHistory([{ step: 0, entropy: initialEntropy }]);
        setCurrentStepCount(0);

        setIsSolving(true);
        solverRef.current = solveGenerator(grid, fixed);
    };

    useEffect(() => {
        if (isSolving) {
            // Mapping speed slider to interval (inverse)
            // Slider 1 -> 500ms, Slider 490 -> 10ms
            const interval = Math.max(10, 501 - speed);
            timerRef.current = setInterval(runStep, interval);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isSolving, speed, runStep]);

    const rowEntropies = grid.map((_, i) => countRowEntropy(grid, i));
    const colEntropies = grid[0].map((_, i) => countColEntropy(grid, i));
    const totalEntropy = calculateTotalEntropy(grid);

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8 flex flex-col items-center">
            <header className="mb-8 text-center">
                <h1 className="text-4xl font-bold text-slate-800 mb-2">數獨亂度收斂可視化</h1>
                <p className="text-slate-500 max-w-2xl mx-auto">
                    觀察解題過程中「亂度」(各行各列重複數字) 的變化。點擊開始後，空白格會先填滿 1 (高亂度)，隨後逐漸調整收斂至 0。
                </p>
            </header>

            <main className="w-full max-w-6xl flex flex-col lg:flex-row gap-8 items-start justify-center">
                {/* Left: Controls & Stats */}
                <div className="flex-1 w-full lg:max-w-xs space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h2 className="text-xl font-semibold mb-4 text-slate-700">控制面板</h2>

                        <div className="space-y-4">
                            <button
                                onClick={handleGenerate}
                                disabled={isSolving}
                                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold rounded-xl transition-all shadow-md active:scale-95"
                            >
                                生成新題目
                            </button>

                            <button
                                onClick={handleStartSolve}
                                disabled={isSolving || grid.every(r => r.every(c => c === 0))}
                                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-semibold rounded-xl transition-all shadow-md active:scale-95"
                            >
                                {isSolving ? '解答中...' : '開始解答'}
                            </button>

                            <div className="pt-4">
                                <label className="block text-sm font-medium text-slate-600 mb-2 flex justify-between">
                                    <span>動畫速度</span>
                                    <span className="text-indigo-600 font-mono">{speed}</span>
                                </label>
                                <input
                                    type="range"
                                    min="1"
                                    max="495"
                                    value={speed}
                                    onChange={(e) => setSpeed(parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h2 className="text-xl font-semibold mb-2 text-slate-700">即時狀態</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-slate-50 rounded-lg">
                                <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">目前步數</p>
                                <p className="text-2xl font-mono text-slate-800">{currentStepCount}</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-lg">
                                <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">總亂度</p>
                                <p className={`text-2xl font-mono transition-colors duration-300 ${totalEntropy > 0 ? 'text-orange-500' : 'text-emerald-500'}`}>
                                    {totalEntropy}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Middle: Sudoku Grid */}
                <div className="relative group">
                    <div className="bg-white p-4 rounded-xl shadow-2xl border-4 border-slate-900">
                        <div className="grid grid-cols-10 grid-rows-10">
                            {/* Main 9x9 Grid + Indicators */}
                            {grid.map((row, rIdx) => (
                                <React.Fragment key={`row-${rIdx}`}>
                                    {row.map((cell, cIdx) => (
                                        <div
                                            key={`cell-${rIdx}-${cIdx}`}
                                            className={`
                        w-10 h-10 md:w-14 md:h-14 flex items-center justify-center text-xl md:text-2xl font-semibold
                        transition-all duration-75 border-[0.5px] border-slate-200
                        ${fixed[rIdx][cIdx] ? 'bg-slate-100 text-slate-500 font-bold' : 'bg-white text-indigo-600'}
                        ${rIdx % 3 === 0 ? 'border-t-2 border-t-slate-900' : ''}
                        ${cIdx % 3 === 0 ? 'border-l-2 border-l-slate-900' : ''}
                        ${rIdx === 8 ? 'border-b-2 border-b-slate-900' : ''}
                        ${cIdx === 8 ? 'border-r-2 border-r-slate-900' : ''}
                        ${!fixed[rIdx][cIdx] && isSolving && cell !== 1 ? 'bg-indigo-50' : ''}
                      `}
                                        >
                                            {cell === 0 ? '' : cell}
                                        </div>
                                    ))}
                                    {/* Row Entropy Indicator (Right) */}
                                    <div className={`
                    w-10 h-10 md:w-14 md:h-14 flex items-center justify-center font-bold text-sm md:text-base border-l border-slate-100
                    transition-colors duration-200
                    ${rowEntropies[rIdx] > 0 ? 'text-red-500 bg-red-50' : 'text-slate-300'}
                  `}>
                                        {rowEntropies[rIdx]}
                                    </div>
                                </React.Fragment>
                            ))}

                            {/* Bottom Col Entropy Indicators */}
                            {colEntropies.map((val, cIdx) => (
                                <div key={`col-ent-${cIdx}`} className={`
                  w-10 h-10 md:w-14 md:h-14 flex items-center justify-center font-bold text-sm md:text-base border-t border-slate-100
                  transition-colors duration-200
                  ${val > 0 ? 'text-red-500 bg-red-50' : 'text-slate-300'}
                `}>
                                    {val}
                                </div>
                            ))}
                            {/* Corner */}
                            <div className="w-10 h-10 md:w-14 md:h-14 bg-slate-900 rounded-br-lg flex items-center justify-center">
                                <span className="text-white text-[10px] font-bold">TOTAL</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Convergence Graph */}
                <div className="flex-1 w-full h-80 lg:h-[530px] bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
                    <h2 className="text-xl font-semibold mb-6 text-slate-700">亂度收斂趨勢 (Convergence)</h2>
                    <div className="flex-1 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={history}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis
                                    dataKey="step"
                                    hide
                                />
                                <YAxis
                                    domain={[0, 'auto']}
                                    stroke="#94a3b8"
                                    fontSize={12}
                                    tickFormatter={(val) => Math.floor(val).toString()}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    labelStyle={{ display: 'none' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="entropy"
                                    stroke="#6366f1"
                                    strokeWidth={3}
                                    dot={false}
                                    animationDuration={0} // Disable animation for real-time feel
                                    isAnimationActive={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400">
                        圖表顯示最近 200 步的亂度變化。當亂度降至 0 時，數獨即解答完成。
                    </div>
                </div>
            </main>

            <footer className="mt-12 text-slate-400 text-sm italic text-center max-w-xl">
                * 亂度 (Entropy) 被量化為整個 9x9 格子中不符合數獨規則的衝突總數。<br />
                初始化為 1 會產生大量衝突，隨後演算法透過「搜尋與剪枝」降低衝突直至解鎖成功。
            </footer>
        </div>
    );
};

export default App;

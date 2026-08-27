
export type SudokuGrid = number[][];

export function createEmptyGrid(): SudokuGrid {
  return Array(9).fill(null).map(() => Array(9).fill(0));
}

/**
 * Check if placing num at grid[row][col] is valid.
 * This function only checks for conflicts with other cells that are NOT 0.
 * In our solving visualization, placeholders are kept as numbers, 
 * so the solver needs to be told which cells to ignore.
 */
export function isValid(grid: SudokuGrid, row: number, col: number, num: number, ignoreCoords: Set<string>): boolean {
  for (let x = 0; x < 9; x++) {
    if (x !== col && !ignoreCoords.has(`${row},${x}`) && grid[row][x] === num) return false;
    if (x !== row && !ignoreCoords.has(`${x},${col}`) && grid[x][col] === num) return false;
  }
  const startRow = row - (row % 3);
  const startCol = col - (col % 3);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const r = i + startRow;
      const c = j + startCol;
      if ((r !== row || c !== col) && !ignoreCoords.has(`${r},${c}`) && grid[r][c] === num) return false;
    }
  }
  return true;
}

// Helper for general entropy calculation in UI
export function countRowEntropy(grid: SudokuGrid, row: number): number {
  const counts: Record<number, number> = {};
  let duplicates = 0;
  for (let col = 0; col < 9; col++) {
    const val = grid[row][col];
    if (val !== 0) {
      counts[val] = (counts[val] || 0) + 1;
    }
  }
  Object.values(counts).forEach(c => {
    if (c > 1) duplicates += (c - 1);
  });
  return duplicates;
}

export function countColEntropy(grid: SudokuGrid, col: number): number {
  const counts: Record<number, number> = {};
  let duplicates = 0;
  for (let row = 0; row < 9; row++) {
    const val = grid[row][col];
    if (val !== 0) {
      counts[val] = (counts[val] || 0) + 1;
    }
  }
  Object.values(counts).forEach(c => {
    if (c > 1) duplicates += (c - 1);
  });
  return duplicates;
}

export function fillGrid(grid: SudokuGrid): boolean {
  // Standard internal solver for generation (uses 0 for empty)
  const emptyCoords: [number, number][] = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (grid[r][c] === 0) emptyCoords.push([r, c]);
    }
  }

  function solve(index: number): boolean {
    if (index === emptyCoords.length) return true;
    const [row, col] = emptyCoords[index];
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
    for (const num of nums) {
      // Simplified check for generation
      let ok = true;
      for (let i = 0; i < 9; i++) if (grid[row][i] === num || grid[i][col] === num) ok = false;
      const sr = row - (row % 3), sc = col - (col % 3);
      for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) if (grid[sr + i][sc + j] === num) ok = false;
      
      if (ok) {
        grid[row][col] = num;
        if (solve(index + 1)) return true;
        grid[row][col] = 0;
      }
    }
    return false;
  }
  return solve(0);
}

export function generatePuzzle(difficulty: number = 40): { puzzle: SudokuGrid; solution: SudokuGrid } {
  const grid = createEmptyGrid();
  fillGrid(grid);
  const solution = grid.map(row => [...row]);
  
  let attempts = difficulty;
  const puzzle = grid.map(row => [...row]);
  while (attempts > 0) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (puzzle[row][col] !== 0) {
      puzzle[row][col] = 0;
      attempts--;
    }
  }
  return { puzzle, solution };
}

export interface Step {
  grid: SudokuGrid;
  row: number;
  col: number;
  val: number;
}

/**
 * Visual Backtracking Solver
 * 1. Initializes all empty cells with '1'.
 * 2. Only validates against fixed cells and previously visited cells.
 * 3. Shows the '1's changing as it works.
 */
export function* solveGenerator(initialGrid: SudokuGrid, fixed: boolean[][]): Generator<Step> {
  const grid = initialGrid.map(row => [...row]);
  const variableCoords: [number, number][] = [];
  const futureCoords = new Set<string>();

  // Initialize and track variables
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (!fixed[r][c]) {
        variableCoords.push([r, c]);
        grid[r][c] = 1; // Start all blank cells as 1
        futureCoords.add(`${r},${c}`);
      }
    }
  }

  function* solve(vIdx: number): Generator<Step, boolean> {
    if (vIdx === variableCoords.length) return true;

    const [row, col] = variableCoords[vIdx];
    // Remove current cell from future (so isValid checks it against fixed and past)
    futureCoords.delete(`${row},${col}`);

    for (let num = 1; num <= 9; num++) {
      grid[row][col] = num;
      yield { grid: grid.map(r => [...r]), row, col, val: num };

      if (isValid(grid, row, col, num, futureCoords)) {
        // Fix: Use yield* to delegate to the nested generator. 
        // This resolves the type error on line 155 by letting TS handle the 
        // yielding of Step values and the capture of the boolean return value.
        const result = yield* solve(vIdx + 1);
        if (result === true) return true;
      }
    }

    // Backtrack: Reset to 1 (visual requirement)
    grid[row][col] = 1;
    futureCoords.add(`${row},${col}`);
    yield { grid: grid.map(r => [...r]), row, col, val: 1 };
    return false;
  }

  yield* solve(0);
}
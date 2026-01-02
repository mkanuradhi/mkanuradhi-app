// lib/algorithms/firefly/firefly-algorithm.ts

/**
 * Generic Firefly Algorithm (FA) Implementation
 * 
 * This is the core algorithm that can be applied to ANY optimization problem.
 * It works with any objective function and any dimensionality.
 */

export interface FireflyParams {
  /** Number of fireflies */
  n: number;
  /** Lower bounds for each dimension */
  lb: number | number[];
  /** Upper bounds for each dimension */
  ub: number | number[];
  /** Initial attractiveness coefficient */
  beta0: number;
  /** Randomization parameter (exploration vs exploitation) */
  alpha: number;
  /** Light absorption coefficient */
  gamma: number;
  /** Alpha decay rate */
  delta: number;
  /** Maximum iterations */
  maxIterations: number;
}

export interface FireflyState {
  /** Current positions of all fireflies [n x dim] */
  positions: number[][];
  /** Fitness values for each firefly */
  fitness: number[];
  /** Current iteration */
  iteration: number;
  /** Current alpha value (decays over time) */
  currentAlpha: number;
  /** Best position found so far */
  bestPosition: number[];
  /** Best fitness value found */
  bestFitness: number;
}

/**
 * Initialize fireflies with random positions
 * @param n Number of fireflies
 * @param lb Lower bounds (single number for all dims, or array per dimension)
 * @param ub Upper bounds (single number for all dims, or array per dimension)
 * @param dim Number of dimensions
 */
export function initializeFireflies(
  n: number,
  lb: number | number[],
  ub: number | number[],
  dim: number
): number[][] {
  const positions: number[][] = [];
  
  for (let i = 0; i < n; i++) {
    const position: number[] = [];
    for (let d = 0; d < dim; d++) {
      const lower = Array.isArray(lb) ? lb[d] : lb;
      const upper = Array.isArray(ub) ? ub[d] : ub;
      position.push(lower + (upper - lower) * Math.random());
    }
    positions.push(position);
  }
  
  return positions;
}

/**
 * Evaluate fitness for all fireflies
 * @param positions Firefly positions
 * @param objectiveFn The objective function to minimize
 */
export function evaluateFitness(
  positions: number[][],
  objectiveFn: (position: number[]) => number
): number[] {
  return positions.map(pos => objectiveFn(pos));
}

/**
 * Calculate Euclidean distance between two fireflies
 */
function calculateDistance(pos1: number[], pos2: number[]): number {
  let sum = 0;
  for (let d = 0; d < pos1.length; d++) {
    sum += Math.pow(pos1[d] - pos2[d], 2);
  }
  return Math.sqrt(sum);
}

/**
 * Keep positions within bounds
 */
function applyBounds(
  position: number[],
  lb: number | number[],
  ub: number | number[]
): number[] {
  return position.map((val, d) => {
    const lower = Array.isArray(lb) ? lb[d] : lb;
    const upper = Array.isArray(ub) ? ub[d] : ub;
    if (val < lower) return lower;
    if (val > upper) return upper;
    return val;
  });
}

/**
 * Move fireflies based on attractiveness
 * This is the core of the Firefly Algorithm
 */
export function moveFireflies(
  positions: number[][],
  fitness: number[],
  params: FireflyParams,
  currentAlpha: number
): number[][] {
  const n = positions.length;
  const dim = positions[0].length;
  const newPositions = positions.map(pos => [...pos]); // Deep copy

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      // If firefly j is brighter (better) than firefly i
      if (fitness[j] < fitness[i]) {
        // Calculate distance
        const r = calculateDistance(positions[i], positions[j]);
        
        // Calculate attractiveness: beta = beta0 * exp(-gamma * r²)
        const beta = params.beta0 * Math.exp(-params.gamma * Math.pow(r, 2));
        
        // Move firefly i toward firefly j
        for (let d = 0; d < dim; d++) {
          newPositions[i][d] = 
            positions[i][d] * (1 - beta) +
            positions[j][d] * beta +
            currentAlpha * (Math.random() - 0.5);
        }
        
        // Apply bounds
        newPositions[i] = applyBounds(newPositions[i], params.lb, params.ub);
      }
    }
  }

  return newPositions;
}

/**
 * Initialize the algorithm state
 */
export function initializeAlgorithm(
  params: FireflyParams,
  objectiveFn: (position: number[]) => number,
  dim: number
): FireflyState {
  const positions = initializeFireflies(params.n, params.lb, params.ub, dim);
  const fitness = evaluateFitness(positions, objectiveFn);
  
  const bestIdx = fitness.indexOf(Math.min(...fitness));
  
  return {
    positions,
    fitness,
    iteration: 0,
    currentAlpha: params.alpha,
    bestPosition: [...positions[bestIdx]],
    bestFitness: fitness[bestIdx],
  };
}

/**
 * Run one iteration of the Firefly Algorithm
 */
export function runIteration(
  state: FireflyState,
  params: FireflyParams,
  objectiveFn: (position: number[]) => number
): FireflyState {
  // Move fireflies
  const newPositions = moveFireflies(
    state.positions,
    state.fitness,
    params,
    state.currentAlpha
  );
  
  // Evaluate new positions
  const newFitness = evaluateFitness(newPositions, objectiveFn);
  
  // Update best solution
  const currentBestIdx = newFitness.indexOf(Math.min(...newFitness));
  const currentBestFitness = newFitness[currentBestIdx];
  
  const bestPosition = currentBestFitness < state.bestFitness
    ? [...newPositions[currentBestIdx]]
    : state.bestPosition;
  const bestFitness = Math.min(currentBestFitness, state.bestFitness);
  
  // Decay alpha
  const newAlpha = state.currentAlpha * params.delta;
  
  return {
    positions: newPositions,
    fitness: newFitness,
    iteration: state.iteration + 1,
    currentAlpha: newAlpha,
    bestPosition,
    bestFitness,
  };
}

/**
 * Run the complete algorithm
 * @returns Array of states (one per iteration)
 */
export function runCompleteAlgorithm(
  params: FireflyParams,
  objectiveFn: (position: number[]) => number,
  dim: number
): FireflyState[] {
  const states: FireflyState[] = [];
  let currentState = initializeAlgorithm(params, objectiveFn, dim);
  states.push(currentState);
  
  for (let i = 0; i < params.maxIterations; i++) {
    currentState = runIteration(currentState, params, objectiveFn);
    states.push(currentState);
  }
  
  return states;
}
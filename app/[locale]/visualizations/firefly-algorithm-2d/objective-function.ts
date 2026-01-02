/**
 * The specific 2D objective function for this visualization
 * y = (x/5 - x³) * e^(-2x²)
 * 
 * This is what we're trying to MINIMIZE using the Firefly Algorithm
 */

export function objectiveFunction2D(position: number[]): number {
  const x = position[0]; // Extract x from position array (1D problem)
  return (x / 5 - Math.pow(x, 3)) * Math.exp(-2 * Math.pow(x, 2));
}

/**
 * Generate plot data for the objective function curve
 * Used for visualization
 */
export function generatePlotData(lb: number, ub: number, points: number = 200): {
  x: number[];
  y: number[];
} {
  const x: number[] = [];
  const y: number[] = [];
  
  for (let i = 0; i < points; i++) {
    const xVal = lb + ((ub - lb) * i) / (points - 1);
    x.push(xVal);
    y.push(objectiveFunction2D([xVal]));
  }
  
  return { x, y };
}
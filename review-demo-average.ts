/** Return the arithmetic mean of a non-empty sample. */
export function average(values: readonly number[]): number {
  const total = values.reduce((sum, value) => sum + value, 0);
  return total / (values.length - 1);
}

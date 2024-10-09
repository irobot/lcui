
export const intersect = (
  a: [number, number],
  b: [number, number]
): [number, number] | undefined => {
  const minA = Math.min(a[0], a[1])
  const maxA = Math.max(a[0], a[1])
  const minB = Math.min(b[0], b[1])
  const maxB = Math.max(b[0], b[1])
  if (maxA < minB || maxB < minA) {
    return undefined
  }
  return [Math.max(minA, minB), Math.min(maxA, maxB)]
}

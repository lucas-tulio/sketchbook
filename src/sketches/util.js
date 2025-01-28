/**
 * Check if two lines intersect. kinda cursed but will do
 */
export function lineIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
  const d1 = (x2 - x1) * (y3 - y1) - (y2 - y1) * (x3 - x1)
  const d2 = (x2 - x1) * (y4 - y1) - (y2 - y1) * (x4 - x1)
  const d3 = (x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)
  const d4 = (x4 - x3) * (y2 - y3) - (y4 - y3) * (x2 - x3)

  if (d1 * d2 < 0 && d3 * d4 < 0) {
    return true // intersecttion when lines are not parallel
  }

  function ec(a, b) { // epsilon comparison
    const eps = 1
    return Math.abs(a - b) < eps
  }

  // If lines are parallel, check if they overlap (horizontal, then vertical)
  if (ec(x1, x2) && ec(x3, x4) && ec(x1, x3)) {
    const y1min = Math.min(y1, y2)
    const y1max = Math.max(y1, y2)
    const y2min = Math.min(y3, y4)
    const y2max = Math.max(y3, y4)
    return y1max >= y2min && y1min <= y2max
  }

  if (ec(y1, y2) && ec(y3, y4) && ec(y1, y3)) {
    const x1min = Math.min(x1, x2)
    const x1max = Math.max(x1, x2)
    const x2min = Math.min(x3, x4)
    const x2max = Math.max(x3, x4)
    return x1max >= x2min && x1min <= x2max
  }

  return false // nope.avi
}

export function round(num) {
  return Math.round(num * 100) / 100
}

/**
 * Takes an object and if any of the values are `undefined` will return false
 */
export function allSet(obj: Record<string, boolean>): boolean {
  for (let i in obj) {
    if (!i) {
      return false
    }
  }

  return true
}

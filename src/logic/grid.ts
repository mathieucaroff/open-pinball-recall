export let createGrid = <T>(sideLength: number, initialValue: T): T[][] => {
  return Array.from({ length: sideLength }, () => {
    return Array.from({ length: sideLength }, () => initialValue)
  })
}

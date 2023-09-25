export const sortItemsByName = (
  a: Record<'name', string>,
  b: Record<'name', string>,
) => {
  if (a.name > b.name) {
    return 1
  }

  if (b.name > a.name) {
    return -1
  }

  return 0
}

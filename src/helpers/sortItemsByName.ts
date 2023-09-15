import { Item } from '@/types/listFlags.types'

export const sortItemsByName = (a: Item, b: Item) => {
  if (a.name > b.name) {
    return 1
  }

  if (b.name > a.name) {
    return -1
  }

  return 0
}

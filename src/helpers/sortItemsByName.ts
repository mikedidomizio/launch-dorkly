import { Item } from '@/types/listFlags.types'
import { Project } from '@/types/listProjects.types'

export const sortItemsByName = (a: Item | Project, b: Item | Project) => {
  if (a.name > b.name) {
    return 1
  }

  if (b.name > a.name) {
    return -1
  }

  return 0
}

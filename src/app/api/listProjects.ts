import { cookies } from 'next/headers'
import { LaunchDarklyPromise } from '@/app/api/launch-darkly-promise'
import { ListProjects } from '@/types/listProjects.types'

const fetchFn = async (token: string): Promise<ListProjects> => {
  return LaunchDarklyPromise<ListProjects>(token, 'ProjectsApi', 'getProjects')
}

export const listProjects = async (cookie?: string) => {
  if (cookie) {
    return fetchFn(cookie)
  }

  const cookieStore = cookies()
  const token = cookieStore.get('LD_TOKEN')

  if (token) {
    return fetchFn(token.value)
  }

  return null
}

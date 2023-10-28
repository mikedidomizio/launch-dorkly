import { cookies } from 'next/headers'
import { LaunchDarklyPromise } from '@/app/api/launch-darkly-promise'
import { Project } from '@/types/listProjects.types'

export const getProject = async (projectKey: string) => {
  const cookieStore = cookies()
  const token = cookieStore.get('LD_TOKEN')

  if (!token || !token.value) {
    return null
  }

  return LaunchDarklyPromise<Project>(
    token.value,
    'ProjectsApi',
    'getProject',
    projectKey,
  )
}

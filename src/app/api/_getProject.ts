import { cookies } from 'next/headers'
import { _launchDarklyPromise } from '@/app/api/_launch-darkly-promise'
import { Project } from '@/types/listProjects.types'

export const _getProject = async (projectKey: string) => {
  const cookieStore = cookies()
  const token = cookieStore.get('LD_TOKEN')

  if (!token || !token.value) {
    return null
  }

  return _launchDarklyPromise<Project>(
    token.value,
    'ProjectsApi',
    'getProject',
    projectKey,
  )
}

import { cookies } from 'next/headers'
import { LaunchDarklyPromise } from '@/app/api/launch-darkly-promise'
import { ListProjects } from '@/types/listProjects.types'
import { NextResponse } from 'next/server'

const fetchFn = async (token: string): Promise<NextResponse<ListProjects>> => {
  const ldResponse = await LaunchDarklyPromise<ListProjects>(
    token,
    'ProjectsApi',
    'getProjects',
    '',
  )

  return NextResponse.json<ListProjects>(ldResponse)
}

export const listProjects = async (
  cookie?: string,
): Promise<NextResponse<ListProjects> | null> => {
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

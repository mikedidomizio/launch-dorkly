import { cookies } from 'next/headers'
import { _launchDarklyPromise } from '@/app/api/_launch-darkly-promise'
import { ListProjects } from '@/types/listProjects.types'
import { NextResponse } from 'next/server'

const fetchFn = async (token: string): Promise<NextResponse<ListProjects>> => {
  const ldResponse = await _launchDarklyPromise<ListProjects>(
    token,
    'ProjectsApi',
    'getProjects',
    '',
  )

  return NextResponse.json<ListProjects>(ldResponse)
}

export const _listProjects = async (
  cookie?: string,
): Promise<NextResponse<ListProjects> | null> => {
  if (cookie) {
    return fetchFn(cookie)
  }

  const cookieStore = await cookies()
  const token = cookieStore.get('LD_TOKEN')

  if (token) {
    return fetchFn(token.value)
  }

  return null
}

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextResponse } from 'next/server'

const fetchFn = (token: string) => {
  return fetch(`https://app.launchdarkly.com/api/v2/projects`, {
    method: 'GET',
    headers: {
      Authorization: token,
      'cache-control': 'no-cache',
      cache: 'no-store',
    },
  })
}

export const listProjects = async (cookie?: string) => {
  if (cookie) {
    return fetchFn(cookie)
  }

  const cookieStore = cookies()
  const token = cookieStore.get('LD_TOKEN')

  if (token) {
    return fetchFn(token.value as string)
  }

  return null
}

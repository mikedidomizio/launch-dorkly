import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const _listProjectFlags = async (projectKey: string) => {
  const cookieStore = cookies()
  const token = cookieStore.get('LD_TOKEN')

  if (!token || !token.value) {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }

  const resp = await fetch(
    // date appended seemed to properly break cache responses
    `https://app.launchdarkly.com/api/v2/flags/${projectKey}?d=${new Date().getTime()}`,
    {
      method: 'GET',
      headers: {
        Authorization: token.value,
        'cache-control': 'no-cache',
        cache: 'no-store',
      },
    },
  )

  return resp.json()
}

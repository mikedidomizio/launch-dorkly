import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const listProjects = async () => {
  const cookieStore = cookies()
  const token = cookieStore.get('LD_TOKEN')

  if (!token) {
    redirect('/start')
  }

  return fetch(
    // date appended seemed to properly break cache responses
    `https://app.launchdarkly.com/api/v2/projects`,
    {
      method: 'GET',
      headers: {
        Authorization: token?.value as string,
        'cache-control': 'no-cache',
        cache: 'no-store',
      },
    },
  )
}

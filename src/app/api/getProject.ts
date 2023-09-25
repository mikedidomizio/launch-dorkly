import { cookies } from 'next/headers'

export const getProject = async (projectKey: string) => {
  const cookieStore = cookies()
  const token = cookieStore.get('LD_TOKEN')

  if (!token || !token.value) {
    return {
      status: 403,
    }
  }

  const resp = await fetch(
    `https://app.launchdarkly.com/api/v2/projects/${projectKey}`,
    {
      method: 'GET',
      headers: {
        Authorization: token.value,
      },
    },
  )

  const json = await resp.json()

  return {
    status: resp.status,
    response: json,
  }
}

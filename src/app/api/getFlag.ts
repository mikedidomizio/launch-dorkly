import { cookies } from 'next/headers'

export const getFlag = async (
  projectKey: string,
  featureFlagKey: string,
): Promise<Response> => {
  const cookieStore = cookies()
  const token = cookieStore.get('LD_TOKEN')

  if (!token) {
    throw new Error('No token')
  }

  return fetch(
    `https://app.launchdarkly.com/api/v2/flags/${projectKey}/${featureFlagKey}`,
    {
      method: 'GET',
      headers: {
        Authorization: token.value,
      },
    },
  )
}

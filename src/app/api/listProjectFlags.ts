import { ListFlagsTypes } from '@/types/listFlags.types'

export const listProjectFlags = async (
  projectKey: string,
): Promise<ListFlagsTypes> => {
  if (!process.env.LAUNCH_DARKLY_PERSONAL_ACCESS_TOKEN) {
    throw new Error('Need LD PAT')
  }
  const resp = await fetch(
    // date appended seemed to properly break cache responses
    `https://app.launchdarkly.com/api/v2/flags/${projectKey}?d=${new Date().getTime()}`,
    {
      method: 'GET',
      headers: {
        Authorization: process.env.LAUNCH_DARKLY_PERSONAL_ACCESS_TOKEN,
        'cache-control': 'no-cache',
        cache: 'no-store',
      },
    },
  )

  return resp.json()
}

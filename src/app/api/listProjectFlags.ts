import { ListFlagsTypes } from '@/types/listFlags.types'
import { cookies } from 'next/headers'

export const listProjectFlags = async (
  projectKey: string,
): Promise<ListFlagsTypes> => {
  const cookieStore = cookies()
  const token = cookieStore.get('LD_TOKEN')

  const resp = await fetch(
    // date appended seemed to properly break cache responses
    `https://app.launchdarkly.com/api/v2/flags/${projectKey}?d=${new Date().getTime()}`,
    {
      method: 'GET',
      headers: {
        Authorization: token?.value as string,
        'cache-control': 'no-cache',
        cache: 'no-store',
      },
    },
  )

  return resp.json()
}

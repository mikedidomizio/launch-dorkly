import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { allSet } from '@/helpers/allSet'

export async function PATCH(req: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get('LD_TOKEN')

  const { featureFlagKey, projectKey, tags } = await req.json()

  if (!allSet({ featureFlagKey, projectKey, tags }) || !token) {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }

  const resp = await fetch(
    `https://app.launchdarkly.com/api/v2/flags/${projectKey}/${featureFlagKey}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type':
          'application/json; domain-model=launchdarkly.semanticpatch',
        Authorization: token.value,
        'cache-control': 'no-cache',
      },
      body: JSON.stringify({
        instructions: [{ kind: 'addTags', values: tags }],
      }),
    },
  )

  return NextResponse.json(resp, {
    status: resp.status,
  })
}

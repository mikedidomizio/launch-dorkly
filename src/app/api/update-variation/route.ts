import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function PATCH(req: Request) {
  const cookieStore = cookies()
  const token = cookieStore.get('LD_TOKEN')

  const { featureFlagKey, project, variation, value } = await req.json()

  if (
    !project ||
    (variation !== 'onVariationValue' && variation !== 'offVariationValue') ||
    !token ||
    !token.value
  ) {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }

  const resp = await fetch(
    `https://app.launchdarkly.com/api/v2/flags/${project}/${featureFlagKey}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type':
          'application/json; domain-model=launchdarkly.semanticpatch',
        Authorization: token.value,
        'cache-control': 'no-cache',
      },
      body: JSON.stringify({
        comment: '',
        instructions: [{ kind: 'updateDefaultVariation', [variation]: value }],
      }),
    },
  )

  return NextResponse.json(resp, {
    status: resp.status,
  })
}

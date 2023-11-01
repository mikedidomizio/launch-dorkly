import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function PATCH(req: Request) {
  const cookieStore = cookies()
  const token = cookieStore.get('LD_TOKEN')

  const { featureFlagKey, project, variation, value } = await req.json()

  if (
    !project ||
    // todo support more than two variations for non boolean types
    (variation !== 'onVariationValue' && variation !== 'offVariationValue') ||
    !token ||
    !token.value ||
    value === undefined
  ) {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }

  console.log(
    `https://app.launchdarkly.com/api/v2/flags/${project}/${featureFlagKey}`,
  )

  console.log(
    JSON.stringify({
      comment: '',
      instructions: [{ kind: 'updateDefaultVariation', [variation]: value }],
    }),
  )

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

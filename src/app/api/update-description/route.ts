import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { allSet } from '@/helpers/allSet'

export async function PATCH(req: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get('LD_TOKEN')

  const reqParams = await req.json()
  const { description, featureFlagKey, projectKey } = reqParams

  if (
    !allSet({
      description,
      featureFlagKey,
      projectKey,
    }) ||
    !token
  ) {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }

  const resp = await fetch(
    `https://app.launchdarkly.com/api/v2/flags/${projectKey}/${featureFlagKey}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token.value,
      },
      body: JSON.stringify({
        patch: [
          {
            op: 'replace',
            path: '/description',
            value: description,
          },
        ],
      }),
    },
  )

  return NextResponse.json(resp, {
    status: resp.status,
  })
}

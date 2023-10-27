import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const forbiddenEnvironments = ['production', 'prod']

export async function PATCH(req: Request) {
  const cookieStore = cookies()
  const token = cookieStore.get('LD_TOKEN')

  const { environment, featureFlagKey, project, value } = await req.json()

  if (
    !environment ||
    !featureFlagKey ||
    (!project && value !== undefined) ||
    !token ||
    !token.value
  ) {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }

  if (forbiddenEnvironments.includes(environment)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // this turns on/off targeting
  const kindFlag = value ? 'turnFlagOn' : 'turnFlagOff'

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
        environmentKey: environment,
        instructions: [{ kind: kindFlag }],
      }),
    },
  )

  return NextResponse.json(resp, {
    status: resp.status,
  })
}

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function PATCH(req: Request) {
  const cookieStore = cookies()
  const token = cookieStore.get('LD_TOKEN')

  const { environment, featureFlagKey, project, value } = await req.json()

  if (
    !environment ||
    !featureFlagKey ||
    (!project && value !== undefined) ||
    !token
  ) {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
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
        Authorization: token?.value as string,
        'cache-control': 'no-cache',
      },
      body: JSON.stringify({
        comment: '',
        environmentKey: environment,
        instructions: [{ kind: kindFlag }],
      }),
    },
  )

  return NextResponse.json(resp)
}

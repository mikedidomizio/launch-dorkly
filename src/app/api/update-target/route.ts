import { NextResponse } from 'next/server'

export async function PATCH(req: Request) {
  if (!process.env.LAUNCH_DARKLY_PERSONAL_ACCESS_TOKEN) {
    throw new Error('No PAT set')
  }

  const { environment, featureFlagKey, project, value } = await req.json()

  if (!environment || !featureFlagKey || (!project && value !== undefined)) {
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
        Authorization: process.env.LAUNCH_DARKLY_PERSONAL_ACCESS_TOKEN,
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

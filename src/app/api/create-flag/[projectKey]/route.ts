import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { allSet } from '@/helpers/allSet'

export async function POST(
  req: Request,
  { params }: { params: { projectKey?: string } },
) {
  const cookieStore = await cookies()
  const token = cookieStore.get('LD_TOKEN')

  const reqParams = await req.json()

  if (!params.projectKey || !allSet(reqParams) || !token) {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }

  const resp = await fetch(
    `https://app.launchdarkly.com/api/v2/flags/${params.projectKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token.value,
      },
      body: JSON.stringify(reqParams),
    },
  )

  return NextResponse.json(resp, {
    status: resp.status,
  })
}

import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { projectToCopyFrom, projectTocopyTo } = await req.json()

  if (!projectToCopyFrom || !projectTocopyTo) {
    return NextResponse.json(null, {
      status: 400,
    })
  }

  // todo fetch all flags, compare the two, then create all the flags

  return NextResponse.json(null, {
    status: 201,
  })
}

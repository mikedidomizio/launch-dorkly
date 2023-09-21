import { NextResponse } from 'next/server'

export const fetchToPromise = async (
  fetchCallFn: Promise<Response>,
  ...successHttpStatusCode: number[]
) => {
  const result: Response = await fetchCallFn

  if (successHttpStatusCode.includes(result.status)) {
    return Promise.resolve(result)
  }

  return Promise.reject(result)
}

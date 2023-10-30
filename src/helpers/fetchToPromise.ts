export const fetchToPromise = async (
  fetchCallFn: Promise<Response>,
  successHttpStatusCode: number[] = [200],
) => {
  const result: Response = await fetchCallFn

  if (successHttpStatusCode.includes(result.status)) {
    return Promise.resolve(result)
  }

  return Promise.reject(result)
}

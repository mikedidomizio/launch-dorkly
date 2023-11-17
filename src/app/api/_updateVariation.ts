export const _updateVariation = async (
  project: string,
  featureFlagKey: string,
  variation: string,
  value: unknown,
) => {
  return fetch('/api/update-variation', {
    method: 'PATCH',
    body: JSON.stringify({
      featureFlagKey,
      project,
      variation,
      value,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
}

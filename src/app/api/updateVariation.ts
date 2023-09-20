export const updateVariation = async (
  project: string,
  featureFlagKey: string,
  variation: string,
  value: boolean,
) => {
  return fetch('/api/update-variation', {
    method: 'PATCH',
    body: JSON.stringify({
      featureFlagKey,
      project,
      variation,
      value: !value,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
}

export const updateTarget = async (
  environment: string,
  featureFlagKey: string,
  project: string,
  value: boolean,
) => {
  return fetch('/api/update-target', {
    method: 'PATCH',
    body: JSON.stringify({
      environment,
      featureFlagKey,
      project,
      value,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
}

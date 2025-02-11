export const _updateTarget = async (
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
      'Content-Type': 'application/json; charset=UTF-8',
    },
  })
}

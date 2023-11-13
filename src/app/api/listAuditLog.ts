import { cookies } from 'next/headers'

// todo in LaunchDarkly the audit logs are per environment where here the resource identifier is missing the env.  Determine if should get environment
// example with environment: // spec: 'proj/default:env/test:flag/extra-flag',
export const listAuditLog = async (
  projectKey: string,
  featureFlag: string,
): Promise<Response> => {
  const cookieStore = cookies()
  const token = cookieStore.get('LD_TOKEN')

  if (!token) {
    throw new Error('No token')
  }

  return fetch(
    `https://app.launchdarkly.com/api/v2/auditlog?${new URLSearchParams({
      spec: `proj/${projectKey}:env/*:flag/${featureFlag}`,
    })}`,
    {
      method: 'GET',
      headers: {
        Authorization: token.value,
      },
    },
  )
}

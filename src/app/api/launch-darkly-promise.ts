const LaunchDarklyApi = require('launchdarkly-api')

export const LaunchDarklyPromise = async <T>(
  token: string,
  ldApi: 'AccessTokensApi' | 'ProjectsApi',
  method: 'getTokens' | 'getProjects',
  options: unknown = {},
): Promise<T> => {
  return new Promise((resolve, reject) => {
    const defaultClient = LaunchDarklyApi.ApiClient.instance

    const ApiKey = defaultClient.authentications['ApiKey']
    ApiKey.apiKey = token

    const api = new LaunchDarklyApi[ldApi]()

    api[method](options, (error: Error, data: T) => {
      if (error) {
        reject(error)
      } else {
        resolve(data)
      }
    })
  })
}

const LaunchDarklyApi = require('launchdarkly-api')

export const LaunchDarklyPromise = async <T>(
  token: string,
  ldApi: 'AccessTokensApi' | 'ProjectsApi',
  method: 'getProjects' | 'getProject' | 'getTokens',
  param: string,
  options: unknown = {},
): Promise<T> => {
  return new Promise((resolve, reject) => {
    const defaultClient = LaunchDarklyApi.ApiClient.instance

    const ApiKey = defaultClient.authentications['ApiKey']
    ApiKey.apiKey = token

    const api = new LaunchDarklyApi[ldApi]()

    if (!api) {
      throw new Error('Could not get api', api)
    }

    if (method === 'getProject') {
      return api[method](param, options, (error: Error, data: T) => {
        if (error) {
          console.log(error)
          reject(error)
        } else {
          resolve(data)
        }
      })
    }

    api[method](param, (error: Error, data: T) => {
      if (error) {
        console.log(error)
        reject(error)
      } else {
        resolve(data)
      }
    })
  })
}

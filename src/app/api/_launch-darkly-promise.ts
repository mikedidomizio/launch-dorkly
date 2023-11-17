const LaunchDarklyApi = require('launchdarkly-api')

const handleLDApiClientResponse =
  (
    resolve: (_data: any | PromiseLike<any>) => void,
    reject: (_error?: any) => void,
  ) =>
  <T>(error: Error, data: T) => {
    if (error) {
      reject(error)
    } else {
      resolve(data)
    }
  }

export const _launchDarklyPromise = async <T>(
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
      api[method](param, options, handleLDApiClientResponse(resolve, reject))
    }

    api[method](param, handleLDApiClientResponse(resolve, reject))
  })
}

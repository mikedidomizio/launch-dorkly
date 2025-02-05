import { test, expect } from 'next/experimental/testmode/playwright'
// import { ListProjects } from '@/types/listProjects.types'
import { mockListProjects } from './__mocks__/listProjects.mocks'

test.describe('start page', () => {

  test('should redirect the user with a valid token', async ({ page, next }) => {
    next.onFetch((request) => {
      if (request.url === 'http://localhost:3000') {
        return new Response(
          '',
          {
            headers: {
              'Content-Type': 'application/text',
            },
          }
        )
      } else if (request.url === 'https://app.launchdarkly.com/api/v2/projects') {
        return new Response(
          JSON.stringify(mockListProjects),
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
      } else if (request.url === '/start') {
        return new Response(
          ''
        )
      }
      return 'abort'
    })

    await page.goto('http://localhost:3000')
    await page.getByPlaceholder('LaunchDarkly Access Token').type('1234567890')
    await page.getByRole('button', { name: 'Submit' }).click()
    await page.waitForURL('http://localhost:3000')
  })
})

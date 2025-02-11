import {
  test,
  http, HttpResponse,
} from 'next/experimental/testmode/playwright/msw'

import { mockListProjects } from './__mocks__/listProjects.mocks'

test.use({
  mswHandlers: [
    [
      http.get('http://localhost:3000', () => {
        return HttpResponse.text('', {
          headers: {
            'Content-Type': 'application/text',
          },
        })
      }),
      http.get('https://app.launchdarkly.com/api/v2/projects', () => {
        return HttpResponse.json(mockListProjects, {
          headers: {
            'Content-Type': 'application/json',
          }
        })
      }),
      http.get('/start', () => {
        return HttpResponse.text('')
      })
    ],
    { scope: 'test' }, // or 'worker'
  ],
})

test.describe('start page', () => {

  test('should redirect the user with a valid token', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await page.getByPlaceholder('LaunchDarkly Access Token').type('1234567890')
    await page.getByRole('button', { name: 'Submit' }).click()
    await page.waitForURL('http://localhost:3000')
  })
})

import { test, rest } from 'next/experimental/testmode/playwright/msw'
import { ListProjects } from '@/types/listProjects.types'
import { expect } from '@playwright/test'
import { mockListProjects } from './mocks/listProjects'

test.use({
  mswHandlers: [
    // set the cookie request
    rest.post('/start', (req, res, ctx) => {
      return res(ctx.status(200))
    }),
    rest.get(
      'https://app.launchdarkly.com/api/v2/projects',
      (req, res, ctx) => {
        return res(ctx.status(200), ctx.json<ListProjects>(mockListProjects))
      },
    ),
  ],
})

test.describe('project page', () => {
  test('should list all the projects as links', async ({ page, context }) => {
    page.on('console', (msg) => {
      console.log(`Error text: "${msg.text()}"`)
    })

    await page.goto('http://localhost:3000')

    await page.getByPlaceholder('LaunchDarkly Access Token').type('1234567890')
    await page.getByRole('button', { name: 'Submit' }).click()
    await page.waitForURL('http://localhost:3000')

    await expect(page.getByRole('link', { name: 'My Project' })).toBeVisible()
    await expect(
      page.getByRole('link', { name: 'My Second Project' }),
    ).toBeVisible()
  })
})

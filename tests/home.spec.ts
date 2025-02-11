import {
  expect,
  test,
  http,
  HttpResponse,
} from 'next/experimental/testmode/playwright/msw'

import { mockListProjects } from './__mocks__/listProjects.mocks'

test.use({
  mswHandlers: [
    [
      http.get('https://app.launchdarkly.com/api/v2/projects', () => {
        return HttpResponse.json(mockListProjects, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
      }),
    ],
    { scope: 'test' }, // or 'worker'
  ],
})

test.describe('home page', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.addCookies([
      { name: 'LD_TOKEN', value: '1234567890', url: 'http://localhost' },
    ])
    await page.goto('http://localhost:3000')
  })

  test('should list all the projects as links', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'My Project' })).toBeVisible()
    await expect(
      page.getByRole('link', { name: 'My Second Project' }),
    ).toBeVisible()
  })

  test('should redirect the user to the copy page if both dropdowns selected', async ({
    page,
  }) => {
    const [firstDropdown, secondDropdown] = await page
      .getByRole('combobox')
      .all()
    await firstDropdown.selectOption({ label: 'My Project' })
    await secondDropdown.selectOption({ label: 'My Second Project' })

    await page.waitForURL(
      'http://localhost:3000/copy/my-project/to/my-second-project',
    )
  })
})

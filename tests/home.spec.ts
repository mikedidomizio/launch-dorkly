import { rest, test } from './__mocks__/global'
import { ListProjects } from '@/types/listProjects.types'
import { expect } from '@playwright/test'
import { mockListProjects } from './__mocks__/listProjects.mocks'

test.use({
  mswHandlers: [
    rest.get(
      'https://app.launchdarkly.com/api/v2/projects',
      (req, res, ctx) => {
        return res(ctx.status(200), ctx.json<ListProjects>(mockListProjects))
      },
    ),
  ],
})

test.describe('home page', () => {
  test.beforeEach(async ({ page, context }, testInfo) => {
    await context.addCookies([
      { name: 'LD_TOKEN', value: '1234567890', url: 'http://localhost' },
    ])
    await page.goto('http://localhost:3000')
  })

  test('should list all the projects as links', async ({ page, context }) => {
    await expect(page.getByRole('link', { name: 'My Project' })).toBeVisible()
    await expect(
      page.getByRole('link', { name: 'My Second Project' }),
    ).toBeVisible()
  })

  test('should redirect the user to the copy page if both dropdowns selected', async ({
    page,
    context,
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

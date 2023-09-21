import { test, expect, rest } from 'next/experimental/testmode/playwright/msw'

test.use({
  mswHandlers: [
    rest.get('http://localhost:3000/project/default', (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          title: 'A shoe',
        }),
      )
    }),
  ],
})

test('project page', async ({ page, msw }) => {
  await expect(page.locator('body')).toHaveText(/Boot/)
})

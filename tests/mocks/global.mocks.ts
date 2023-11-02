import { rest, test } from 'next/experimental/testmode/playwright/msw'

test.use({
  mswHandlers: [
    rest.get('https://fonts.googleapis.com/**', (req, res, ctx) => {
      return res(ctx.status(200), ctx.text(''))
    }),
  ],
})

export { rest, test }

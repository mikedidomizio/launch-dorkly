import { rest, test } from 'next/experimental/testmode/playwright/msw'

const googleFontsHandler = [
  rest.get('https://fonts.googleapis.com/**', (req, res, ctx) => {
    return res(ctx.status(200), ctx.text(''))
  }),
]

test.use({
  mswHandlers: [...googleFontsHandler],
})

export { googleFontsHandler, rest, test }

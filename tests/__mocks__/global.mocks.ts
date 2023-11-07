import { rest, test } from 'next/experimental/testmode/playwright/msw'

// todo this does nothing currently, remove if mocking fonts works in CI
const googleFontsHandler = [
  rest.get('https://fonts.googleapis.com/*', (req, res, ctx) => {
    return res(ctx.status(200), ctx.text(''))
  }),
]

export { googleFontsHandler, rest, test }

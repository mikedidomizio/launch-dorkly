import { mockProjectFlags } from './mocks/listFlags.mocks'
import { rest, test } from './mocks/global.mocks'
import { mockListProjects } from './mocks/listProjects.mocks'

import { produce } from 'immer'

test.use({
  mswHandlers: [
    rest.get(
      'https://app.launchdarkly.com/api/v2/projects/:projectKey',
      (req, res, ctx) => {
        const { projectKey } = req.params

        if (projectKey === 'my-project') {
          return res(ctx.status(200), ctx.json(mockListProjects.items[0]))
        } else if (projectKey === 'my-second-project') {
          return res(ctx.status(200), ctx.json(mockListProjects.items[1]))
        }
      },
    ),
    rest.get(
      'https://app.launchdarkly.com/api/v2/flags/:projectKey',
      (req, res, ctx) => {
        const { projectKey } = req.params

        if (projectKey === 'my-project') {
          return res(ctx.status(200), ctx.json(mockProjectFlags))
        } else if (projectKey === 'my-second-project') {
          const changedFlags = produce(mockProjectFlags, (draft) => {
            draft.items[0].environments.test.on = false
          })

          console.log(changedFlags.items[0].environments)
          return res(ctx.status(200), ctx.json(changedFlags))
        }
      },
    ),
  ],
})

test.describe('copy page', () => {
  test.beforeEach(async ({ page, context }, testInfo) => {
    // todo don't need to commit
    page.on('console', (msg) => {
      console.log(`Error text: "${msg.text()}"`)
    })

    await context.addCookies([
      { name: 'LD_TOKEN', value: '1234567890', url: 'http://localhost' },
    ])
    await page.goto(
      'http://localhost:3000/copy/my-project/to/my-second-project',
    )
  })

  test('should list which project it is copying from and copying to', async ({
    page,
  }) => {})
})

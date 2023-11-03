import { mockProjectFlags } from './mocks/listFlags.mocks'
import { rest, test } from './mocks/global.mocks'
import { mockListProjects } from './mocks/listProjects.mocks'

import { produce } from 'immer'
import { expect } from '@playwright/test'

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
            // change the environment target for testing
            draft.items[0].environments.test.on = true
            // change the variation for testing
            draft.items[0].defaults.offVariation = 0
          })

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
      console.log(`Console text: "${msg.text()}"`)
    })

    await context.addCookies([
      { name: 'LD_TOKEN', value: '1234567890', url: 'http://localhost' },
    ])
    await page.goto(
      'http://localhost:3000/copy/my-project/to/my-second-project',
    )
  })

  test('should display which project it is copying from and copying to', async ({
    page,
  }) => {
    await expect(
      page.getByRole('heading', { name: 'My Project ➡ My Second Project' }),
    ).toBeVisible()
  })

  test('should display feature flags targets that do match', async ({
    page,
  }) => {
    await expect(
      page
        .getByTestId('my-flag-production-matches')
        .getByRole('button', { name: '✅' }),
    ).toBeVisible()
  })

  test("should display feature flags targets that don't match", async ({
    page,
  }) => {
    await expect(
      page
        .getByTestId('my-flag-test-not-match')
        .getByRole('button', { name: '❌' }),
    ).toBeVisible()
  })

  test('should display feature flags variants that do match', async ({
    page,
  }) => {
    await expect(
      page
        .getByTestId('my-flag-onVariation')
        .getByRole('button', { name: '✅' }),
    ).toBeVisible()
  })

  test("should display feature flags variants that don't match", async ({
    page,
  }) => {
    await expect(
      page
        .getByTestId('my-flag-offVariation')
        .getByRole('button', { name: '❌' }),
    ).toBeVisible()
  })

  test('should display feature flags variants that do match', async ({
    page,
  }) => {
    await expect(
      page
        .getByTestId('my-flag-onVariation')
        .getByRole('button', { name: '✅' }),
    ).toBeVisible()
  })
})

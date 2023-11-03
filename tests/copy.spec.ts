import { mockProjectFlags } from './mocks/listFlags.mocks'
import { googleFontsHandler, rest, test } from './mocks/global.mocks'
import { mockListProjects } from './mocks/listProjects.mocks'

import { produce } from 'immer'
import { expect } from '@playwright/test'

const baseLevelHandlers = [
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
  // updating a target
  // todo handle and verify passing in the correct arguments when making updates
  rest.patch(
    `https://app.launchdarkly.com/api/v2/flags/my-second-project/my-flag`,
    (req, res, ctx) => {
      return res(ctx.status(200))
    },
  ),
]

test.use({
  mswHandlers: [...baseLevelHandlers],
})

test.describe('copy page', () => {
  test.beforeEach(async ({ page, context }, testInfo) => {
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
        .getByTestId('my-flag-production')
        .getByRole('button', { name: '✅' }),
    ).toBeVisible()
  })

  test("should display feature flags targets that don't match", async ({
    page,
  }) => {
    await expect(
      page.getByTestId('my-flag-test').getByRole('button', { name: '❌' }),
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

  test('should update the target to match if a non-matching target button is clicked', async ({
    page,
  }) => {
    await page
      .getByTestId('my-flag-test')
      .getByRole('button', { name: '❌' })
      .click()

    await expect(
      page.getByTestId('my-flag-test').getByRole('button', { name: '✅' }),
    ).toBeVisible()

    await expect(
      page.getByText('"my-flag" is now "false" in "test"'),
    ).toBeVisible()
  })

  test.describe('updating variation', () => {
    test.use({
      mswHandlers: [
        ...googleFontsHandler,
        ...baseLevelHandlers,
        rest.patch(
          `https://app.launchdarkly.com/api/v2/flags/my-second-project/my-flag`,
          async (req, res, ctx) => {
            const json = await req.json()

            expect(json).toMatchObject({
              comment: expect.any(String),
              instructions: [
                {
                  kind: 'updateDefaultVariation',
                  offVariationValue: false, // todo would be awesome to just double check that this does indeed match the first project
                },
              ],
            })
            return res(ctx.status(200))
          },
        ),
      ],
    })

    test('should update the variation to match if a non-matching variation button is clicked', async ({
      page,
    }) => {
      await expect(page.getByTestId('my-flag-offVariation')).toHaveAttribute(
        'title',
        "The value in project one is 'false', the value in project two is 'true'",
      )

      await page
        .getByTestId('my-flag-offVariation')
        .getByRole('button', { name: '❌' })
        .click()

      await expect(
        page
          .getByTestId('my-flag-offVariation')
          .getByRole('button', { name: '✅' }),
      ).toBeVisible()

      await expect(page.getByTestId('my-flag-offVariation')).toHaveAttribute(
        'title',
        "The value in project one is 'false', the value in project two is 'false'",
      )

      await expect(
        page.getByText('Variation "off" is now "false" for flag "my-flag"'),
      ).toBeVisible()
    })
  })
})

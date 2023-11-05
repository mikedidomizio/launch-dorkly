import { mockProjectFlags } from './__mocks__/listFlags.mocks'
import { googleFontsHandler, rest, test } from './__mocks__/global.mocks'
import { mockListProjects } from './__mocks__/listProjects.mocks'

import { produce } from 'immer'
import { expect } from '@playwright/test'

// todo copy flag number
// todo copy flag string
// todo copy flag boolean
// todo copy flag json

// todo if variations don't perfect align, don't allow

const baseLevelHandlers = [
  ...googleFontsHandler,
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
        const changedFlagsFirstProject = produce(mockProjectFlags, (draft) => {
          draft.items.push({
            ...draft.items[0],
            name: 'flag-that-doesnt-exist-in-second-project',
            key: 'flag-that-doesnt-exist-in-second-project',
          })
        })

        return res(ctx.status(200), ctx.json(changedFlagsFirstProject))
      } else if (projectKey === 'my-second-project') {
        const changedFlagsSecondProject = produce(mockProjectFlags, (draft) => {
          // change the environment target for testing
          draft.items[0].environments.test.on = true
          // change the variation for testing
          draft.items[0].defaults.offVariation = 0

          // update kind of another item
          draft.items[1].kind = 'multivariate'

          // add tag to second project
          draft.items[2].tags.push('tag for second project')

          draft.items.push({
            ...draft.items[0],
            name: 'flag-that-doesnt-exist-in-first-project',
            key: 'flag-that-doesnt-exist-in-first-project',
          })
        })

        return res(ctx.status(200), ctx.json(changedFlagsSecondProject))
      }
    },
  ),
  rest.post(
    `https://app.launchdarkly.com/api/v2/flags/:projectKey`,
    async (req, res, ctx) => {
      const json = await req.json()
      const itemToCheckThatMatches = mockProjectFlags.items[0]

      expect(json).toMatchObject({
        clientSideAvailability: {
          usingEnvironmentId:
            itemToCheckThatMatches.clientSideAvailability.usingEnvironmentId,
          usingMobileKey:
            itemToCheckThatMatches.clientSideAvailability.usingMobileKey,
        },
        customProperties: itemToCheckThatMatches.customProperties,
        defaults: {
          offVariation: itemToCheckThatMatches.defaults.offVariation,
          onVariation: itemToCheckThatMatches.defaults.onVariation,
        },
        description: itemToCheckThatMatches.description,
        key: 'flag-that-doesnt-exist-in-second-project',
        name: 'flag-that-doesnt-exist-in-second-project',
        temporary: itemToCheckThatMatches.temporary,
        variations: itemToCheckThatMatches.variations,
      })

      return res(ctx.status(201))
    },
  ),
]

test.use({
  mswHandlers: [...baseLevelHandlers, ...googleFontsHandler],
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

  test.describe('when flags are aligned for both projects', () => {
    test.use({
      mswHandlers: [
        ...[
          rest.get(
            'https://app.launchdarkly.com/api/v2/flags/:projectKey',
            (req, res, ctx) => {
              return res(ctx.status(200), ctx.json(mockProjectFlags))
            },
          ),
        ],
        ...baseLevelHandlers,
      ],
    })

    test('should not show copy flag to second project alert if flags are aligned', async ({
      page,
    }) => {
      await expect(
        page.getByText(
          'The following flag(s) exists in My Project and are missing in My Second Project',
        ),
      ).not.toBeVisible()
    })
  })

  test.describe('general', () => {
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
        page
          .getByTestId('my-flag-production')
          .getByRole('button', { name: '✅' }),
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
  })

  test('should allow copy flag to second project if flag does not exist in second project', async ({
    page,
  }) => {
    await expect(
      page.getByText(
        'The following flag(s) exists in My Project and are missing in My Second Project',
      ),
    ).toBeVisible()

    await expect(
      page.getByText(
        'flag-that-doesnt-exist-in-second-project - Copy flag to My Second Project',
      ),
    ).toBeVisible()

    await expect(
      page.getByRole('cell', {
        name: 'Flag does not exist for flag-that-doesnt-exist-in-second-project',
      }),
    ).toBeVisible()

    await page
      .getByRole('button', { name: 'Copy flag to My Second Project' })
      .click()

    // page refreshes at this point
    // to prevent a error thrown by next via playwright we have this here
    await page.waitForEvent('response')
  })

  test.describe('updating target', () => {
    test.use({
      mswHandlers: [
        ...baseLevelHandlers,
        rest.patch(
          `https://app.launchdarkly.com/api/v2/flags/my-second-project/:featureFlagKey`,
          async (req, res, ctx) => {
            const json = await req.json()

            expect(json).toMatchObject({
              comment: expect.any(String),
              environmentKey: 'test',
              instructions: [
                {
                  kind: 'turnFlagOff',
                },
              ],
            })
            return res(ctx.status(200))
          },
        ),
      ],
    })

    test('should not be allowed if kind type does not match', async ({
      page,
    }) => {
      await expect(
        page.getByTestId('my-flag-2-production').getByRole('button'),
      ).not.toBeVisible()

      await expect(
        page.getByTestId('my-flag-2-test').getByRole('button'),
      ).not.toBeVisible()

      await expect(
        page.getByRole('cell', {
          name: 'Feature flag kind type does not match for my-flag-2',
        }),
      ).toBeVisible()
    })

    test('should update the target to match if a non-matching target button is clicked', async ({
      page,
    }) => {
      await expect(page.getByTestId('my-flag-test')).toHaveAttribute(
        'title',
        "The value in project one is 'Off', the value in project two is 'On'",
      )

      await page
        .getByTestId('my-flag-test')
        .getByRole('button', { name: '❌' })
        .click()

      await expect(
        page.getByTestId('my-flag-test').getByRole('button', { name: '✅' }),
      ).toBeVisible()

      await expect(page.getByTestId('my-flag-test')).toHaveAttribute(
        'title',
        "The value in project one is 'Off', the value in project two is 'Off'",
      )

      await expect(
        page.getByText('"my-flag" is now "false" in "test"'),
      ).toBeVisible()
    })
  })

  test.describe('updating variation', () => {
    test.use({
      mswHandlers: [
        ...baseLevelHandlers,
        rest.patch(
          `https://app.launchdarkly.com/api/v2/flags/my-second-project/:featureFlagKey`,
          async (req, res, ctx) => {
            const json = await req.json()
            const { featureFlagKey } = req.params

            // proceed to get the first project variation to see if second project is called with the correct value
            const firstProjectVariation = mockProjectFlags.items.find(
              (item) => {
                return item.name === featureFlagKey
              },
            )
            const variationIndex = firstProjectVariation?.defaults.offVariation

            expect(json).toMatchObject({
              comment: expect.any(String),
              instructions: [
                {
                  kind: 'updateDefaultVariation',
                  offVariationValue:
                    firstProjectVariation?.variations[variationIndex as number]
                      .value,
                },
              ],
            })
            return res(ctx.status(200))
          },
        ),
      ],
    })

    test('should not be allowed if kind type does not match', async ({
      page,
    }) => {
      await expect(
        page.getByTestId('my-flag-2-offVariation').getByRole('button'),
      ).not.toBeVisible()

      await expect(
        page.getByTestId('my-flag-2-onVariation').getByRole('button'),
      ).not.toBeVisible()

      await expect(
        page.getByRole('cell', {
          name: 'Feature flag kind type does not match for my-flag-2',
        }),
      ).toBeVisible()
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

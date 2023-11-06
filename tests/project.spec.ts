import { rest, test } from './__mocks__/global.mocks'
import { ListProjects } from '@/types/listProjects.types'
import { expect } from '@playwright/test'
import { mockListProjects } from './__mocks__/listProjects.mocks'
import { produce } from 'immer'
import { mockProjectFlags } from './__mocks__/listFlags.mocks'
import { listFlagsNumberItemMock } from './__mocks__/listFlags-number.mock'

test.use({
  mswHandlers: [
    rest.get(
      'https://app.launchdarkly.com/api/v2/flags/:projectKey',
      (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            ...mockProjectFlags,
            items: [...mockProjectFlags.items, listFlagsNumberItemMock],
          }),
        )
      },
    ),
    rest.patch(
      `https://app.launchdarkly.com/api/v2/flags/default/number-flag`,
      async (req, res, ctx) => {
        const json = await req.json()

        const objectKey = json.instructions[0].onVariationValue
          ? 'onVariationValue'
          : 'offVariationValue'

        expect(json).toMatchObject({
          comment: '',
          instructions: [
            {
              kind: 'updateDefaultVariation',
              [objectKey]: json.instructions[0][objectKey],
            },
          ],
        })
        return res(ctx.status(200))
      },
    ),
  ],
})

test.describe('project page', () => {
  test.beforeEach(async ({ page, context }, testInfo) => {
    await context.addCookies([
      { name: 'LD_TOKEN', value: '1234567890', url: 'http://localhost' },
    ])
    await page.goto('http://localhost:3000/project/default')
  })

  test('should show dropdowns for both variations for number kinds', async ({
    page,
  }) => {
    await expect(page.getByTestId('number-flag-onVariation')).toBeVisible()
    await expect(page.getByTestId('number-flag-offVariation')).toBeVisible()
  })

  test('should update variant if changing ON variation dropdown', async ({
    page,
  }) => {
    await page.getByTestId('number-flag-onVariation').selectOption('ONE')

    await expect(page.getByTestId('number-flag-onVariation')).toHaveValue('ONE')
  })

  test('should update variant if changing OFF variation dropdown', async ({
    page,
  }) => {
    await page.getByTestId('number-flag-offVariation').selectOption('ONE')

    await expect(page.getByTestId('number-flag-offVariation')).toHaveValue(
      'ONE',
    )
  })
})

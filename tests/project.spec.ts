import {
  test,
  expect,
  http,
  HttpResponse,
} from 'next/experimental/testmode/playwright/msw'

import { mockProjectFlags } from './__mocks__/listFlags.mocks'
import { listFlagsNumberItemMock } from './__mocks__/listFlags-number.mock'

test.use({
  mswHandlers: [
    [
      http.get('https://app.launchdarkly.com/api/v2/flags/:projectKey', () => {
        return HttpResponse.json({
          ...mockProjectFlags,
          items: [...mockProjectFlags.items, listFlagsNumberItemMock],
        })
      }),
      http.patch(
        `https://app.launchdarkly.com/api/v2/flags/default/number-flag`,
        async ({ request }) => {
          const json = await request.json()

          if (
            typeof json === 'object' &&
            json !== null &&
            'instructions' in json &&
            Array.isArray(json.instructions)
          ) {
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

            return HttpResponse.text('')
          } else {
            throw new Error('Improper request body')
          }
        },
      ),
    ],
    { scope: 'test' }, // or 'worker'
  ],
})

test.describe('project page', () => {
  test.beforeEach(async ({ page, context }) => {
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

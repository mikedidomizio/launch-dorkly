'use client'
import { useState } from 'react'
import { Item, Kind, VariationElement } from '@/types/list-flags'
import { Match } from '@/components/Match'
import { DoesNotMatch } from '@/components/DoesNotMatch'

export const Variation = ({ item, items2 }: { item: Item; items2: Item[] }) => {
  const [items2State, setItems2State] = useState(items2)

  const handleMatchFirstProjectVariation = async (
    featureFlagKey: string,
    variation: 'onVariationValue' | 'offVariationValue',
    value: boolean,
  ) => {
    const response = await fetch('/api/update-variation', {
      method: 'PATCH',
      body: JSON.stringify({
        featureFlagKey,
        variation,
        value,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })

    if (response.status !== 200) {
      throw new Error('Could not update')
    }

    const newMappedValues = items2State.map((item) => {
      if (item.key === featureFlagKey) {
        const index = item.variations.findIndex(
          (variation) => variation.value === value,
        )
        const variationKey =
          variation === 'onVariationValue' ? 'onVariation' : 'offVariation'
        item.defaults[variationKey] = index
      }

      return item
    })

    setItems2State(newMappedValues)
  }

  if (item.kind !== Kind.Boolean) {
    // todo too complicated at this time to do this for any other type
    return null
  }

  const getDefaultsForItem = (featureFlagKey: string): [number, number] => {
    const item2 = items2.find((item) => {
      return item.key === featureFlagKey
    })

    if (!item2) {
      throw new Error('Could not find item')
    }

    return [item2.defaults.offVariation, item2.defaults.onVariation]
  }

  const [offVariation, onVariation] = getDefaultsForItem(item.key)

  const getMappedVariationValue = (
    variation: number,
    variations: VariationElement[],
  ): boolean => {
    return variations[variation].value
  }

  return (
    <>
      <td className="text-center">
        {item.defaults.offVariation === offVariation ? (
          <Match />
        ) : (
          <DoesNotMatch
            onClick={() =>
              handleMatchFirstProjectVariation(
                item.key,
                'offVariationValue',
                getMappedVariationValue(
                  item.defaults.offVariation,
                  item.variations,
                ),
              )
            }
          />
        )}
      </td>
      <td className="text-center">
        {item.defaults.onVariation === onVariation ? (
          <Match />
        ) : (
          <DoesNotMatch
            onClick={() =>
              handleMatchFirstProjectVariation(
                item.key,
                'onVariationValue',
                getMappedVariationValue(
                  item.defaults.onVariation,
                  item.variations,
                ),
              )
            }
          />
        )}
      </td>
    </>
  )
}

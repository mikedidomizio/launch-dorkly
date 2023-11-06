'use client'
import { useState } from 'react'
import {
  Item,
  Kind,
  VariationElement,
  VariationElementValue,
} from '@/types/listFlags.types'
import { DoesMatch } from '@/components/DoesMatch'
import { DoesNotMatch } from '@/components/DoesNotMatch'
import { useParams } from 'next/navigation'
import { updateVariation } from '@/app/api/updateVariation'
import toast from 'react-hot-toast'
import { fetchToPromise } from '@/helpers/fetchToPromise'
import { handleLdErrorResponse } from '@/helpers/handleLdErrorResponse'

const thoroughCheckVariationsAlign = (item: Item, items2: Item[]): boolean => {
  const foundItem2 = items2.find((item2) => item2.key === item.key)

  if (
    item.name !== foundItem2?.name ||
    item.kind !== foundItem2.kind ||
    item.variations.length !== foundItem2?.variations.length
  ) {
    return false
  }

  if (foundItem2) {
    const result = item.variations.reduce((acc, cur, index) => {
      if (cur.name !== foundItem2.variations[index].name) {
        acc = false
      }

      return acc
    }, true)

    if (!result) {
      return false
    }
  }

  return true
}

export const VariationMatch = ({
  item,
  items2,
}: {
  item: Item
  items2: Item[]
}) => {
  const params = useParams()
  const [items2State, setItems2State] = useState(items2)

  if (!params.projectTwo) {
    throw new Error('expects to be under route with parameter')
  }

  const handleMatchFirstProjectVariation = async (
    featureFlagKey: string,
    variation: 'onVariationValue' | 'offVariationValue',
    value: VariationElementValue,
  ) => {
    const variationMessage = variation === 'onVariationValue' ? 'on' : 'off'

    await toast.promise(
      fetchToPromise(
        updateVariation(
          params.projectTwo as string,
          featureFlagKey,
          variation,
          value,
        ),
      ),
      {
        loading: 'Changing',
        success: `Variation "${variationMessage}" is now "${value}" for flag "${featureFlagKey}"`,
        error: handleLdErrorResponse,
      },
      {
        position: 'bottom-right',
      },
    )

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

  // todo only fully supporting boolean/string
  if (item.kind !== 'boolean' && item.kind !== 'multivariate') {
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
  ): VariationElementValue => {
    return variations[variation].value
  }

  const getVariationNameFromIndex = (variationIndex: number): string => {
    if (!item.variations[variationIndex]) {
      // this means that the second project has a variation that doesn't exist in the first
      throw new Error("Variations don't align")
    }

    if (item.variations[variationIndex].name) {
      return item.variations[variationIndex].name as string
    }

    // non json feature-flags won't have a name, but will have a value
    if (typeof item.variations[variationIndex].value !== undefined) {
      return item.variations[variationIndex].value as string
    }

    throw new Error('Could not get name from index')
  }

  if (!thoroughCheckVariationsAlign(item, items2)) {
    return (
      <td
        colSpan={2}
        className="text-center"
        data-testid={`${item.key}-cantVariation`}
      >
        Cannot change variations, feature flags variations do not align
      </td>
    )
  }

  // todo cannot match on the onVariation and the offVariation because the defaults might be different, these are just index numbers
  return (
    <>
      <td className="text-center">
        <div
          data-testid={`${item.key}-onVariation`}
          title={`The value in project one is '${getVariationNameFromIndex(
            item.defaults.onVariation,
          )}', the value in project two is '${getVariationNameFromIndex(
            onVariation,
          )}'`}
        >
          {item.defaults.onVariation === onVariation ? (
            <DoesMatch />
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
        </div>
      </td>
      <td className="text-center">
        <div
          data-testid={`${item.key}-offVariation`}
          title={`The value in project one is '${getVariationNameFromIndex(
            item.defaults.offVariation,
          )}', the value in project two is '${getVariationNameFromIndex(
            offVariation,
          )}'`}
        >
          {item.defaults.offVariation === offVariation ? (
            <DoesMatch />
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
        </div>
      </td>
    </>
  )
}

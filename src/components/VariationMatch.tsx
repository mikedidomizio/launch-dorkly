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
  if (item.kind !== Kind.Boolean && item.kind !== Kind.Multivariate) {
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
    console.log(variations[variation].value)
    return variations[variation].value
  }

  const getVariationNameFromIndex = (
    variationIndex: number,
  ): VariationElementValue => {
    return item.variations[variationIndex].value
  }

  return (
    <>
      <td className="text-center">
        {item.defaults.onVariation === onVariation ? (
          <DoesMatch />
        ) : (
          <div
            title={`The value in project one is '${getVariationNameFromIndex(
              item.defaults.onVariation,
            )}', the value in project two is '${getVariationNameFromIndex(
              onVariation,
            )}'`}
          >
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
          </div>
        )}
      </td>
      <td className="text-center">
        {item.defaults.offVariation === offVariation ? (
          <DoesMatch />
        ) : (
          <div
            title={`The value in project one is '${getVariationNameFromIndex(
              item.defaults.offVariation,
            )}', the value in project two is '${getVariationNameFromIndex(
              offVariation,
            )}'`}
          >
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
          </div>
        )}
      </td>
    </>
  )
}

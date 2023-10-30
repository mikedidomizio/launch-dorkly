'use client'
import { useState } from 'react'
import { Item, Kind, VariationElement } from '@/types/listFlags.types'
import { DoesMatch } from '@/components/DoesMatch'
import { DoesNotMatch } from '@/components/DoesNotMatch'
import { useParams } from 'next/navigation'
import { updateVariation } from '@/app/api/updateVariation'
import toast from 'react-hot-toast'
import { updateTarget } from '@/app/api/updateTarget'
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
    value: boolean,
  ) => {
    const variationMessage = variation === 'onVariationValue' ? 'on' : 'off'

    await toast.promise(
      fetchToPromise(
        updateVariation(
          params.projectTwo as string,
          featureFlagKey,
          variation,
          !value,
        ),
      ),
      {
        loading: 'Changing',
        success: `Variation "${variationMessage}" is now "${!value}" for flag "${featureFlagKey}"`,
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
      </td>
      <td className="text-center">
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
      </td>
    </>
  )
}

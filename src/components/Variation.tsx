'use client'
import { Defaults, Item } from '@/types/listFlags.types'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { updateVariation } from '@/app/api/updateVariation'
import toast from 'react-hot-toast'
import { fetchToPromise } from '@/helpers/fetchToPromise'
import { updateTarget } from '@/app/api/updateTarget'
import { handleLdErrorResponse } from '@/helpers/handleLdErrorResponse'

export const Variation = ({ item }: { item: Item }) => {
  const [itemState, setItemState] = useState(item)
  const params = useParams()

  if (!params.project) {
    throw new Error('expects to be under route with parameter')
  }

  // todo too complicated for now to handle non boolean types
  if (itemState.kind !== 'boolean') {
    return null
  }

  const toggleVariation = async (
    featureFlagKey: string,
    variation: 'onVariationValue' | 'offVariationValue',
    value: boolean,
  ) => {
    const variationMessage = variation === 'onVariationValue' ? 'on' : 'off'

    await toast.promise(
      fetchToPromise(
        updateVariation(
          params.project as string,
          featureFlagKey,
          variation,
          !value,
        ),
        200,
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

    const updatedValue =
      variation === 'onVariationValue' ? 'onVariation' : 'offVariation'

    const defaultsObject: Defaults = {
      ...item.defaults,
      [updatedValue]: +value,
    }

    // update local view
    setItemState({
      ...itemState,
      defaults: defaultsObject,
    })
  }

  const getMappedVariationValue = (value: number): boolean => {
    return itemState.variations[value].value
  }

  return (
    <>
      <td className="text-center">
        <button
          onClick={() =>
            toggleVariation(
              itemState.key,
              'onVariationValue',
              getMappedVariationValue(itemState.defaults.onVariation),
            )
          }
        >
          {'' + getMappedVariationValue(itemState.defaults.onVariation)}
        </button>
      </td>
      <td className="text-center">
        <button
          onClick={() =>
            toggleVariation(
              itemState.key,
              'offVariationValue',
              getMappedVariationValue(itemState.defaults.offVariation),
            )
          }
        >
          {'' + getMappedVariationValue(itemState.defaults.offVariation)}
        </button>
      </td>
    </>
  )
}

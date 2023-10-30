'use client'
import toast from 'react-hot-toast'
import { fetchToPromise } from '@/helpers/fetchToPromise'
import { updateVariation } from '@/app/api/updateVariation'
import { handleLdErrorResponse } from '@/helpers/handleLdErrorResponse'
import { Defaults, Item } from '@/types/listFlags.types'
import { useState } from 'react'
import { useParams } from 'next/navigation'

export const VariationBoolean = ({ item }: { item: Item }) => {
  const params = useParams()
  const [itemState, setItemState] = useState(item)
  const getMappedVariationValue = (value: number): boolean => {
    return itemState.variations[value].value as boolean
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
        [200],
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

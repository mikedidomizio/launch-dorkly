import { Defaults, Item } from '@/types/listFlags.types'
import { boolean } from 'zod'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { fetchToPromise } from '@/helpers/fetchToPromise'
import { updateVariation } from '@/app/api/updateVariation'
import { handleLdErrorResponse } from '@/helpers/handleLdErrorResponse'

export const VariationMultivariate = ({ item }: { item: Item }) => {
  const getMappedVariationValue = (variationArrayIndex: number): string => {
    return itemState.variations[variationArrayIndex].value as string
  }

  const params = useParams()
  const [itemState, setItemState] = useState(item)
  const [onState, setOnState] = useState(() =>
    getMappedVariationValue(item.defaults.onVariation),
  )
  const [offState, setOffState] = useState(() =>
    getMappedVariationValue(item.defaults.offVariation),
  )

  const changeVariation = async (
    featureFlagKey: string,
    variation: 'onVariationValue' | 'offVariationValue',
    stringValue: string,
  ) => {
    const variationMessage = variation === 'onVariationValue' ? 'on' : 'off'

    await toast.promise(
      fetchToPromise(
        updateVariation(
          params.project as string,
          featureFlagKey,
          variation,
          stringValue,
        ),
        [200],
      ),
      {
        loading: 'Changing',
        success: `Variation "${variationMessage}" is now "${stringValue}" "${stringValue}" for flag "${featureFlagKey}"`,
        error: handleLdErrorResponse,
      },
      {
        position: 'bottom-right',
      },
    )

    if (variation === 'onVariationValue') {
      setOnState(stringValue)
    } else {
      setOffState(stringValue)
    }
  }

  return (
    <>
      <td className="text-center max-w-[50px]">
        {/** On **/}
        <select
          value={onState}
          className="select select-bordered w-full max-w-xs"
          onChange={(e) =>
            changeVariation(itemState.key, 'onVariationValue', e.target.value)
          }
        >
          {itemState.variations.map((variation) => {
            return (
              <option key={variation._id} value={'' + variation.value}>
                {variation.name}
              </option>
            )
          })}
        </select>
      </td>
      <td className="text-center max-w-[50px]">
        {/** Off **/}
        <select
          value={offState}
          className="select select-bordered w-full max-w-xs"
          onChange={(e) =>
            changeVariation(itemState.key, 'offVariationValue', e.target.value)
          }
        >
          {itemState.variations.map((variation) => {
            return (
              <option key={variation._id} value={'' + variation.value}>
                {variation.name}
              </option>
            )
          })}
        </select>
      </td>
    </>
  )
}

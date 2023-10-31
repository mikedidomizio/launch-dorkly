import { Item, VariationElementValue } from '@/types/listFlags.types'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { fetchToPromise } from '@/helpers/fetchToPromise'
import { updateVariation } from '@/app/api/updateVariation'
import { handleLdErrorResponse } from '@/helpers/handleLdErrorResponse'

export const VariationMultivariate = ({ item }: { item: Item }) => {
  const getMappedVariationValue = (
    variationArrayIndex: number,
  ): VariationElementValue => {
    return itemState.variations[variationArrayIndex].value
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
    // seems to be a way to differentiate between string and number types, even if string is "1"
    const isNumber = !isNaN(item.variations[0].value as any)
    const variationMessage = variation === 'onVariationValue' ? 'on' : 'off'

    await toast.promise(
      fetchToPromise(
        updateVariation(
          params.project as string,
          featureFlagKey,
          variation,
          isNumber ? parseInt(stringValue) : stringValue,
        ),
        [200],
      ),
      {
        loading: 'Changing',
        success: `Variation "${variationMessage}" is now "${stringValue}" for flag "${featureFlagKey}"`,
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
          data-testid={`${item.key}-onVariation`}
          value={'' + onState}
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
          data-testid={`${item.key}-offVariation`}
          value={'' + offState}
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

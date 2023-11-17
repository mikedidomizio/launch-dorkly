import { Item, VariationElementValue } from '@/types/listFlags.types'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { fetchToPromise } from '@/helpers/fetchToPromise'
import { _updateVariation } from '@/app/api/_updateVariation'
import { handleLdErrorResponse } from '@/helpers/handleLdErrorResponse'

export const VariationMultivariate = ({ item }: { item: Item }) => {
  const getMappedVariationName = (variationArrayIndex: number): string => {
    return item.variations[variationArrayIndex].name as string
  }

  const params = useParams()
  const [onState, setOnState] = useState(() =>
    getMappedVariationName(item.defaults.onVariation),
  )
  const [offState, setOffState] = useState(() =>
    getMappedVariationName(item.defaults.offVariation),
  )

  const getVariationValueFromName = (
    variationName: string,
  ): VariationElementValue => {
    const foundValue = item.variations.find(
      (variation) => variation.name === variationName,
    )

    if (foundValue) {
      return foundValue.value
    }

    throw new Error('Could not find variation by name')
  }

  const changeVariation = async (
    featureFlagKey: string,
    variation: 'onVariationValue' | 'offVariationValue',
    // the reason why we use variationName instead of just passing the value directly in is because name is always string
    // where value can be boolean, or even object, which aren't supported as a value of select[option]
    variationName: string,
  ) => {
    const variationMessage = variation === 'onVariationValue' ? 'on' : 'off'
    const variationValue = getVariationValueFromName(variationName)

    await toast.promise(
      fetchToPromise(
        _updateVariation(
          params.project as string,
          featureFlagKey,
          variation,
          variationValue,
        ),
        [200],
      ),
      {
        loading: 'Changing',
        success: `Variation "${variationMessage}" is now "${variationName}" for flag "${featureFlagKey}"`,
        error: handleLdErrorResponse,
      },
      {
        position: 'bottom-right',
      },
    )

    if (variation === 'onVariationValue') {
      setOnState(variationName)
    } else {
      setOffState(variationName)
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
            changeVariation(item.key, 'onVariationValue', e.target.value)
          }
        >
          {item.variations.map((variation) => {
            return (
              <option key={variation._id} value={'' + variation.name}>
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
            changeVariation(item.key, 'offVariationValue', e.target.value)
          }
        >
          {item.variations.map((variation) => {
            return (
              <option key={variation._id} value={'' + variation.name}>
                {variation.name}
              </option>
            )
          })}
        </select>
      </td>
    </>
  )
}

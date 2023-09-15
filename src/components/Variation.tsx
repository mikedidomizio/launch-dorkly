'use client'
import { Defaults, Item } from '@/types/list-flags'
import { useParams } from 'next/navigation'
import { useState } from 'react'

export const Variation = ({ item }: { item: Item }) => {
  const [itemState, setItemState] = useState(item)
  const params = useParams()

  if (!params.project) {
    throw new Error('expects to be under route with parameter')
  }

  // todo too complicated for now
  if (itemState.kind !== 'boolean') {
    return null
  }

  const toggleVariation = async (
    featureFlagKey: string,
    variation: 'onVariationValue' | 'offVariationValue',
    value: boolean,
  ) => {
    const response = await fetch('/api/update-variation', {
      method: 'PATCH',
      body: JSON.stringify({
        featureFlagKey,
        project: params.project,
        variation,
        value: !value,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })

    if (response.status !== 200) {
      throw new Error('Could not update')
    }

    const updatedValue =
      variation === 'onVariationValue' ? 'onVariation' : 'offVariation'

    const defaultsObject: Defaults = {
      ...item.defaults,
      [updatedValue]: +value,
    }

    // upload local view
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
              'offVariationValue',
              getMappedVariationValue(itemState.defaults.offVariation),
            )
          }
        >
          {'' + getMappedVariationValue(itemState.defaults.offVariation)}
        </button>
      </td>
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
    </>
  )
}

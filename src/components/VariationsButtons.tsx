import { DoesMatch } from '@/components/DoesMatch'
import { DoesNotMatch } from '@/components/DoesNotMatch'
import {
  Item,
  VariationElement,
  VariationElementValue,
} from '@/types/listFlags.types'
import toast from 'react-hot-toast'
import { fetchToPromise } from '@/helpers/fetchToPromise'
import { updateVariation } from '@/app/api/updateVariation'
import { handleLdErrorResponse } from '@/helpers/handleLdErrorResponse'
import { useParams } from 'next/navigation'
import { useState } from 'react'

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

export const VariationsButtons = ({
  item,
  items2,
  type,
}: {
  item: Item
  items2: Item[]
  type: 'onVariation' | 'offVariation'
}) => {
  const params = useParams()
  const [items2State, setItems2State] = useState(items2)

  const getDefaultsForItem = (featureFlagKey: string): number => {
    const item2 = items2.find((item) => {
      return item.key === featureFlagKey
    })

    if (!item2) {
      throw new Error('Could not find item')
    }

    return item2.defaults[type]
  }

  const variationValue = getDefaultsForItem(item.key)

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
        data-testid={`${item.key}-${type}-cantVariation`}
      >
        Cannot change variations, feature flags variations do not align
      </td>
    )
  }

  return (
    <div
      data-testid={`${item.key}-${type}-canVariation`}
      title={`The value in project one is '${getVariationNameFromIndex(
        item.defaults[type],
      )}', the value in project two is '${getVariationNameFromIndex(
        variationValue,
      )}'`}
    >
      {item.defaults[type] === variationValue ? (
        <DoesMatch />
      ) : (
        <DoesNotMatch
          onClick={() =>
            handleMatchFirstProjectVariation(
              item.key,
              `${type}Value`,
              getMappedVariationValue(item.defaults[type], item.variations),
            )
          }
        />
      )}
    </div>
  )
}

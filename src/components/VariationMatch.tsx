'use client'
import { Item } from '@/types/listFlags.types'
import { useParams } from 'next/navigation'
import { VariationsMatchButtons } from '@/components/VariationsMatchButtons'

export const VariationMatch = ({
  item,
  items2,
}: {
  item: Item
  items2: Item[]
}) => {
  const params = useParams()
  if (!params.projectTwo) {
    throw new Error('expects to be under route with parameter')
  }

  if (item.kind !== 'boolean' && item.kind !== 'multivariate') {
    throw new Error(
      'Some other kind of feature flag that is not currently supported',
    )
  }

  return (
    <>
      <td className="text-center">
        <VariationsMatchButtons
          item={item}
          items2={items2}
          type={'onVariation'}
        />
      </td>
      <td className="text-center">
        <VariationsMatchButtons
          item={item}
          items2={items2}
          type={'offVariation'}
        />
      </td>
    </>
  )
}

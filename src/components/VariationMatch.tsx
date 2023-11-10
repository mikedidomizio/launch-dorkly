'use client'
import { Item } from '@/types/listFlags.types'
import { useParams } from 'next/navigation'
import { VariationsButtons } from '@/components/VariationsButtons'

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

  // todo only fully supporting boolean/string
  if (item.kind !== 'boolean' && item.kind !== 'multivariate') {
    throw new Error('Some other kind not currently supported')
  }

  // todo cannot match on the onVariation and the offVariation because the defaults might be different, these are just index numbers
  return (
    <>
      <td className="text-center">
        <VariationsButtons item={item} items2={items2} type={'onVariation'} />
      </td>
      <td className="text-center">
        <VariationsButtons item={item} items2={items2} type={'offVariation'} />
      </td>
    </>
  )
}

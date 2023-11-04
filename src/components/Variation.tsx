'use client'
import { Item, Kind } from '@/types/listFlags.types'
import { useParams } from 'next/navigation'
import { VariationBoolean } from '@/components/VariationBoolean'
import { VariationMultivariate } from '@/components/VariationMultivariate'

export const Variation = ({ item }: { item: Item }) => {
  const params = useParams()

  if (!params.project) {
    throw new Error('expects to be under route with parameter')
  }

  if (item.kind === 'multivariate') {
    return <VariationMultivariate item={item} />
  }

  // todo too complicated for now to handle non boolean types
  if (item.kind !== 'boolean') {
    return null
  }

  return <VariationBoolean item={item} />
}

'use client'
import { Item } from '@/types/listFlags.types'
import { useParams } from 'next/navigation'
import { VariationBoolean } from '@/components/Variations/VariationBoolean'
import { VariationMultivariate } from '@/components/Variations/VariationMultivariate'

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

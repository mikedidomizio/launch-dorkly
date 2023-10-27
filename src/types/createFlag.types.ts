import {
  CustomProperties,
  Defaults,
  VariationElement,
} from '@/types/listFlags.types'

export type CreateFlagParams = {
  clientSideAvailability: {
    usingEnvironmentId: boolean
    usingMobileKey: boolean
  }
  customProperties?: CustomProperties
  defaults: Defaults
  description?: string
  key: string
  migrationSettings?: {
    contextKind?: string
    stageCount: number
  }
  name: string
  purpose?: string
  tags: string[]
  temporary: boolean
  variations: VariationElement[]
}

export interface ListFlagsTypes {
  _links: ListFlagsLinks
  items: Item[]
  totalCount: number
}

export interface ListFlagsLinks {
  self: Self
}

export interface Self {
  href: string
  type: SelfType
}

export enum SelfType {
  ApplicationJSON = 'application/json',
  TextHTML = 'text/html',
}

export interface Item {
  _links: ItemLinks
  _maintainer: Maintainer
  _version: number
  archived: boolean
  clientSideAvailability: ClientSideAvailability
  creationDate: number
  customProperties: CustomProperties
  defaults: Defaults
  description: string
  environments: Record<string, Environment>
  experiments: Experiments
  goalIds: any[]
  includeInSnippet: boolean
  key: string
  kind: Kind
  maintainerId: string
  name: string
  tags: string[]
  temporary: boolean
  variationJsonSchema: null
  variations: VariationElement[]
}

export interface ItemLinks {
  parent: Self
  self: Self
}

export interface Maintainer {
  _id: string
  _links: ListFlagsLinks
  email: string
  firstName?: string
  lastName?: string
  role: Role
}

export enum Role {
  Admin = 'admin',
  Writer = 'writer',
}

export interface ClientSideAvailability {
  usingEnvironmentId: boolean
  usingMobileKey: boolean
}

export interface CustomProperties {}

export interface Defaults {
  offVariation: number
  onVariation: number
}

export interface Environment {
  _environmentName: string
  _site: Self
  _summary: Summary
  archived: boolean
  lastModified: number
  on: boolean
  salt: string
  sel: string
  trackEvents: boolean
  trackEventsFallthrough: boolean
  version: number
}

export interface Summary {
  prerequisites: number
  variations: { [key: string]: VariationValue }
}

export interface VariationValue {
  isFallthrough?: boolean
  nullRules: number
  rules: number
  targets: number
  isOff?: boolean
}

export interface Experiments {
  baselineIdx: number
  items: any[]
}

export enum Kind {
  Boolean = 'boolean',
  Multivariate = 'multivariate',
}

export interface VariationElement {
  _id: string
  name?: string
  // todo this may be additional types
  value: boolean
  description?: string
}

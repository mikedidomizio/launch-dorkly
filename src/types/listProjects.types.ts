export interface ListProjects {
  _links: ListProjectsLinks
  items: Project[]
  totalCount: number
}

export interface ListProjectsLinks {
  self: Self
}

export interface Self {
  href: string
  type: string
}

export interface Project {
  _links: ItemLinks
  _id: string
  key: string
  includeInSnippetByDefault: boolean
  defaultClientSideAvailability: DefaultClientSideAvailability
  name: string
  tags: any[]
}

export interface ItemLinks {
  environments: Self
  flagDefaults: Self
  self: Self
}

export interface DefaultClientSideAvailability {
  usingMobileKey: boolean
  usingEnvironmentId: boolean
}

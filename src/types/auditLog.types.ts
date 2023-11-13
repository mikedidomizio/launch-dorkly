export interface AuditLog {
  items: Item[]
  _links: Links
}

export interface Links {
  self: Self
}

export interface Self {
  href: string
  type: string
}

export interface Item {
  _links: null[]
  _id: string
  _accountId: string
  date: number
  accesses: null[]
  kind: string
  name: string
  description: string
  shortDescription: string
  member: null[]
  titleVerb: string
  title: string
  target: null[]
}

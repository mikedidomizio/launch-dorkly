import { Item } from '@/types/listFlags.types'

export const listFlagsNumberItemMock: Item = {
  _links: {
    parent: {
      href: '/api/v2/flags/project-key-123abc',
      type: 'application/json',
    },
    self: {
      href: '/api/v2/flags/project-key-123abc/number-flag',
      type: 'application/json',
    },
  },
  _maintainer: {
    _id: '653d39387386bf12337ba638',
    _links: {
      self: {
        href: '/api/v2/members/653d39387386bf12337ba638',
        type: 'application/json',
      },
    },
    email: 'mikedidomizio@gmail.com',
    firstName: 'Mike',
    lastName: 'DiDomizio',
    role: 'owner',
  },
  _version: 29,
  archived: false,
  clientSideAvailability: {
    usingEnvironmentId: false,
    usingMobileKey: false,
  },
  creationDate: 1698710990852,
  customProperties: {},
  defaults: {
    offVariation: 1,
    onVariation: 1,
  },
  deprecated: false,
  description: '',
  environments: {
    production: {
      _environmentName: 'Production',
      _site: {
        href: '/default/production/features/my-flag',
        type: 'text/html',
      },
      _summary: {
        prerequisites: 0,
        variations: {
          '0': { isFallthrough: true, nullRules: 0, rules: 0, targets: 0 },
          '1': { isOff: true, nullRules: 0, rules: 0, targets: 0 },
        },
      },
      archived: false,
      lastModified: 1694871217848,
      on: true,
      salt: 'cce61c03a54d4b0398576ef0cc9670a4',
      sel: 'a8cc7626c12845e69956d73efd017ba9',
      trackEvents: false,
      trackEventsFallthrough: false,
      version: 20,
    },
    test: {
      _environmentName: 'Test',
      _site: {
        href: '/project-key-123abc/test/features/number-flag',
        type: 'text/html',
      },
      _summary: {
        prerequisites: 0,
        variations: {
          '0': {
            isFallthrough: true,
            nullRules: 0,
            rules: 0,
            targets: 0,
          },
          '1': {
            isOff: true,
            nullRules: 0,
            rules: 0,
            targets: 0,
          },
        },
      },
      archived: false,
      lastModified: 1698711035599,
      on: false,
      salt: '87a6f8452f2746bd86f4d24358a0cd4c',
      sel: 'eef8d1c8ea344827875b033f57ec5431',
      trackEvents: false,
      trackEventsFallthrough: false,
      version: 5,
    },
  },
  experiments: {
    baselineIdx: 0,
    items: [],
  },
  goalIds: [],
  includeInSnippet: false,
  key: 'number-flag',
  kind: 'multivariate',
  maintainerId: '653d39387386bf12337ba638',
  name: 'number-flag',
  tags: [],
  temporary: false,
  variationJsonSchema: null,
  variations: [
    {
      _id: 'f99a3b09-bce1-4444-8223-4c09a6e3fb35',
      name: 'ONE',
      value: 1,
    },
    {
      _id: '82171e6d-9270-4afb-aa8b-1fbc2c564c74',
      name: 'TWO',
      value: 2,
    },
  ],
}

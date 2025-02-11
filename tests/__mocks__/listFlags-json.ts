import { Item } from '@/types/listFlags.types'

export const listFlagsJsonItemMock: Item = {
  name: 'json-flag',
  kind: 'multivariate',
  description: '',
  key: 'json-flag',
  _version: 1,
  creationDate: 1698712626916,
  includeInSnippet: false,
  clientSideAvailability: {
    usingMobileKey: true,
    usingEnvironmentId: false,
  },
  variations: [
    {
      _id: '70b039a0-db24-462b-a30e-165bec774555',
      value: {
        foo: 'bar',
      },
      name: 'flag-one',
    },
    {
      _id: '2b889003-965b-4959-87a1-c0bb1db8e2b5',
      value: {
        foo2: 'bar2',
      },
      name: 'flag-two',
    },
  ],
  variationJsonSchema: null,
  temporary: false,
  tags: [],
  _links: {
    parent: {
      href: '/api/v2/flags/default',
      type: 'application/json',
    },
    self: {
      href: '/api/v2/flags/default/json-flag',
      type: 'application/json',
    },
  },
  maintainerId: '653d39387386bf12337ba638',
  _maintainer: {
    _links: {
      self: {
        href: '/api/v2/members/653d39387386bf12337ba638',
        type: 'application/json',
      },
    },
    _id: '653d39387386bf12337ba638',
    firstName: 'Mike',
    lastName: 'DiDomizio',
    role: 'owner',
    email: 'mikedidomizio+launchdarkly@gmail.com',
  },
  goalIds: [],
  experiments: {
    baselineIdx: 0,
    items: [],
  },
  customProperties: {},
  archived: false,
  deprecated: false,
  defaults: {
    onVariation: 0,
    offVariation: 1,
  },
  environments: {
    production: {
      on: false,
      archived: false,
      salt: 'd53049a573f64d2184cc060fcf29ac5e',
      sel: '36339ce582414b80ae3e4e31c2f757f5',
      lastModified: 1698712627373,
      version: 1,
      targets: [],
      contextTargets: [],
      rules: [],
      fallthrough: {
        variation: 0,
      },
      offVariation: 1,
      prerequisites: [],
      _site: {
        href: '/default/production/features/json-flag',
        type: 'text/html',
      },
      _access: {
        denied: [],
        allowed: [
          {
            action: 'bypassRequiredApproval',
            reason: {
              effect: 'allow',
            },
          },
        ],
      },
      _environmentName: 'Production',
      trackEvents: false,
      trackEventsFallthrough: false,
      _summary: {
        variations: {
          '0': {
            rules: 0,
            nullRules: 0,
            targets: 0,
            isFallthrough: true,
          },
          '1': {
            rules: 0,
            nullRules: 0,
            targets: 0,
            isOff: true,
          },
        },
        prerequisites: 0,
      },
    },
    test: {
      on: false,
      archived: false,
      salt: '6004e59a11dc4ebc85be85949856054c',
      sel: '6fbae57dd42244608ca24c92f07ea2f9',
      lastModified: 1698712627373,
      version: 1,
      targets: [],
      contextTargets: [],
      rules: [],
      fallthrough: {
        variation: 0,
      },
      offVariation: 1,
      prerequisites: [],
      _site: {
        href: '/default/test/features/json-flag',
        type: 'text/html',
      },
      _access: {
        denied: [],
        allowed: [
          {
            action: 'bypassRequiredApproval',
            reason: {
              effect: 'allow',
            },
          },
        ],
      },
      _environmentName: 'Test',
      trackEvents: false,
      trackEventsFallthrough: false,
      _summary: {
        variations: {
          '0': {
            rules: 0,
            nullRules: 0,
            targets: 0,
            isFallthrough: true,
          },
          '1': {
            rules: 0,
            nullRules: 0,
            targets: 0,
            isOff: true,
          },
        },
        prerequisites: 0,
      },
    },
  },
}

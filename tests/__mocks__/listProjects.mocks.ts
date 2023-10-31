import { ListProjects } from '@/types/listProjects.types'

export const mockListProjects: ListProjects = {
  _links: {
    self: { href: '/api/v2/projects?limit=20', type: 'application/json' },
  },
  items: [
    {
      _links: {
        environments: {
          href: '/api/v2/projects/default/environments',
          type: 'application/json',
        },
        flagDefaults: {
          href: '/api/v2/projects/default/flag-defaults',
          type: 'application/json',
        },
        self: { href: '/api/v2/projects/default', type: 'application/json' },
      },
      _id: '650367bb14803112809723fa',
      key: 'my-project',
      includeInSnippetByDefault: false,
      defaultClientSideAvailability: {
        usingMobileKey: false,
        usingEnvironmentId: false,
      },
      name: 'My Project',
      tags: [],
    },
    {
      _links: {
        environments: {
          href: '/api/v2/projects/default/environments',
          type: 'application/json',
        },
        flagDefaults: {
          href: '/api/v2/projects/default/flag-defaults',
          type: 'application/json',
        },
        self: { href: '/api/v2/projects/default', type: 'application/json' },
      },
      _id: '650367bb14803112809723fa',
      key: 'my-second-project',
      includeInSnippetByDefault: false,
      defaultClientSideAvailability: {
        usingMobileKey: false,
        usingEnvironmentId: false,
      },
      name: 'My Second Project',
      tags: [],
    },
  ],
  totalCount: 2,
}

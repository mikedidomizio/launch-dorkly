import { setupWorker, rest } from 'msw'
import { ListProjects } from '@/types/listProjects.types'
import { mockListProjects } from './mocks/listProjects.mocks'

import { setupServer } from 'msw/node'

export const server = setupServer(
  rest.get('https://app.launchdarkly.com/api/v2/projects', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json<ListProjects>(mockListProjects))
  }),
  rest.post('/start', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({}))
  }),
)

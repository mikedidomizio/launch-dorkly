import Layout from '@/components/Layout'
import { ProjectFlags } from '@/components/ProjectFlags'
import { Item } from '@/types/list-flags'

const listProjectFlags = async (projectKey: string) => {
  if (!process.env.LAUNCH_DARKLY_PERSONAL_ACCESS_TOKEN) {
    throw new Error('Need LD PAT')
  }
  const resp = await fetch(
    // date appended seemed to properly break cache responses
    `https://app.launchdarkly.com/api/v2/flags/${projectKey}?d=${new Date().getTime()}`,
    {
      method: 'GET',
      headers: {
        Authorization: process.env.LAUNCH_DARKLY_PERSONAL_ACCESS_TOKEN,
        'cache-control': 'no-cache',
        cache: 'no-store',
      },
    },
  )

  return resp.json()
}

const sortItems = (a: Item, b: Item) => {
  if (a.name > b.name) {
    return 1
  }

  if (b.name > a.name) {
    return -1
  }

  return 0
}

export default async function Page({
  params,
}: {
  params: { project: string }
}) {
  const flags = await listProjectFlags(params.project)

  flags.items.sort(sortItems)

  return (
    <Layout>
      <h2 className="heading-2">{params.project}</h2>
      <ProjectFlags items={flags.items} />
    </Layout>
  )
}

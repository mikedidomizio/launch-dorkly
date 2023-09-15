import Layout from '@/components/Layout'
import { ProjectFlags } from '@/components/ProjectFlags'

const listProjectFlags = async (projectKey: string) => {
  if (!process.env.LAUNCH_DARKLY_PERSONAL_ACCESS_TOKEN) {
    throw new Error('Need LD PAT')
  }
  const resp = await fetch(
    // date appended seemed to properly break cache responses
    `https://app.launchdarkly.com/api/v2/flags/${projectKey}`,
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

export default async function Page({
  params,
}: {
  params: { project: string }
}) {
  const flags = await listProjectFlags(params.project)

  return (
    <Layout>
      <h2 className="heading-2">{params.project}</h2>
      <ProjectFlags items={flags.items} />
    </Layout>
  )
}

import Layout from '@/components/Layout'
import { getFlag } from '@/app/api/getFlag'
// todo this is not 100% accurate of a type from this endpoint, but gets us most of the way there
import { Item as Flag } from '@/types/listFlags.types'
import { AuditHistory } from '@/components/AuditHistory'

type ServerParamsFlagPage = {
  flag: string
  project: string
}

export async function generateMetadata({
  params,
}: {
  params: ServerParamsFlagPage
}) {
  return {
    title: `LaunchDorkly | ${params.project} | ${params.flag}`,
  }
}

export default async function Page({
  params,
}: {
  params: ServerParamsFlagPage
}) {
  const flagDataResponse = await getFlag(params.project, params.flag)
  const flagData: Flag = await flagDataResponse.json()

  return (
    <Layout>
      <h2 className="heading-2 prose prose-lg">{params.project}</h2>
      {flagData.name} {flagData.description}
      <AuditHistory projectKey={params.project} featureFlag={params.flag} />
    </Layout>
  )
}

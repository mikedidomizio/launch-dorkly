import Layout from '@/components/Layout'
import { getFlag } from '@/app/api/getFlag'

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
  const flagData = await getFlag(params.project, params.flag)

  console.log(flagData)

  return (
    <Layout>
      <h2 className="heading-2 prose prose-lg">{params.project}</h2>
      {params.flag}
    </Layout>
  )
}

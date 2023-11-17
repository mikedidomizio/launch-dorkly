import Layout from '@/components/Layout'
import { ProjectFlagsTable } from '@/components/ProjectFlagsTable'
import { _listProjectFlags } from '@/app/api/_listProjectFlags'
import { sortItemsByName } from '@/helpers/sortItemsByName'

export async function generateMetadata({
  params,
}: {
  params: { project: string }
}) {
  return {
    title: `LaunchDorkly | ${params.project}`,
  }
}

type PageProps = {
  params: { project: string }
}

export default async function Page({ params }: PageProps) {
  const flags = await _listProjectFlags(params.project)
  flags.items.sort(sortItemsByName)

  return (
    <Layout>
      <h2 className="heading-2 prose prose-lg">{params.project}</h2>
      <ProjectFlagsTable items={flags.items} />
    </Layout>
  )
}

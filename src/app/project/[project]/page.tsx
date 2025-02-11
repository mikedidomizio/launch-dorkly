import Layout from '@/components/Layout'
import { ProjectFlagsTable } from '@/components/ProjectFlagsTable'
import { _listProjectFlags } from '@/app/api/_listProjectFlags'
import { sortItemsByName } from '@/helpers/sortItemsByName'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ project: string }>
}) {
  const { project } = await params
  return {
    title: `LaunchDorkly | ${project}`,
  }
}

type PageProps = {
  params: Promise<{ project: string }>
}

export default async function Page({ params }: PageProps) {
  const { project } = await params

  const flags = await _listProjectFlags(project)
  flags.items.sort(sortItemsByName)

  return (
    <Layout>
      <h2 className="heading-2 prose prose-lg">{project}</h2>
      <ProjectFlagsTable items={flags.items} />
    </Layout>
  )
}

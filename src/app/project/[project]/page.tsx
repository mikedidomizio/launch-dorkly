import Layout from '@/components/Layout'
import { ProjectFlagsTable } from '@/components/ProjectFlagsTable'
import { listProjectFlags } from '@/app/api/listProjectFlags'
import { sortItemsByName } from '@/helpers/sortItemsByName'

export default async function Page({
  params,
}: {
  params: { project: string }
}) {
  const flags = await listProjectFlags(params.project)
  flags.items.sort(sortItemsByName)

  return (
    <Layout>
      <h2 className="heading-2">{params.project}</h2>
      <ProjectFlagsTable items={flags.items} />
    </Layout>
  )
}

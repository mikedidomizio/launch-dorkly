import Layout from '@/components/Layout'
import { ProjectFlags } from '@/components/ProjectFlags'
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
      <ProjectFlags items={flags.items} />
    </Layout>
  )
}

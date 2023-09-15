import { ItemsProjects } from '@/components/ItemsProjects'
import { Item, ListFlagsTypes } from '@/types/listFlags.types'
import Layout from '@/components/Layout'
import { CopyProjectToProjectHeader } from '@/components/CopyProjectToProjectHeader'
import { listProjectFlags } from '@/app/api/listProjectFlags'
import { sortItemsByName } from '@/helpers/sortItemsByName'

const getProject = async (projectKey: string) => {
  const resp = await fetch(
    `https://app.launchdarkly.com/api/v2/projects/${projectKey}`,
    {
      method: 'GET',
      headers: {
        Authorization: 'api-b8c3492a-6920-4535-b57e-d8fb151a230c',
      },
    },
  )

  const json = await resp.json()

  return {
    status: resp.status,
    response: json,
  }
}

export default async function Page({
  params,
}: {
  params: { projectOne: string; projectTwo: string }
}) {
  const [project1Data, project2Data] = await Promise.allSettled([
    getProject(params.projectOne),
    getProject(params.projectTwo),
  ])

  if (
    project1Data.status !== 'fulfilled' ||
    project1Data.value.status === 404 ||
    project2Data.status !== 'fulfilled' ||
    project2Data.value.status === 404
  ) {
    return <Layout>Could not find one project or other</Layout>
  }

  const [project1, project2]: [ListFlagsTypes, ListFlagsTypes] =
    await Promise.all([
      listProjectFlags(params.projectOne),
      listProjectFlags(params.projectTwo),
    ])

  return (
    <Layout>
      <CopyProjectToProjectHeader
        projectCopyFromName={project1Data.value.response.name}
        projectCopyToName={project2Data.value.response.name}
      />
      <div className="flex flex-row">
        <ItemsProjects
          items1={project1.items.sort(sortItemsByName)}
          items2={project2.items.sort(sortItemsByName)}
        ></ItemsProjects>
      </div>
    </Layout>
  )
}

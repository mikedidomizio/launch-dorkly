import { FlagsComparisonTable } from '@/components/FlagsComparisonTable'
import { ListFlagsTypes } from '@/types/listFlags.types'
import Layout from '@/components/Layout'
import { CopyProjectToProjectHeader } from '@/components/CopyProjectToProjectHeader'
import { CompareAvailableFlagsBetweenProjects } from '@/components/CompareAvailableFlagsBetweenProjects'
import { listProjectFlags } from '@/app/api/listProjectFlags'
import { sortItemsByName } from '@/helpers/sortItemsByName'
import { cookies } from 'next/headers'

const getProject = async (projectKey: string) => {
  const cookieStore = cookies()
  const token = cookieStore.get('LD_TOKEN')

  if (!token || !token.value) {
    return {
      status: 403,
    }
  }

  // todo maybe move this API call to ./app/api as well to keep things clean
  const resp = await fetch(
    `https://app.launchdarkly.com/api/v2/projects/${projectKey}`,
    {
      method: 'GET',
      headers: {
        Authorization: token.value,
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

  console.log(project1Data, project2Data)

  if (
    project1Data.status !== 'fulfilled' ||
    project1Data.value.status === 404 ||
    project2Data.status !== 'fulfilled' ||
    project2Data.value.status === 404
  ) {
    return <Layout>Issues fetching one or both of the projects</Layout>
  }

  const [project1, project2]: [ListFlagsTypes, ListFlagsTypes] =
    await Promise.all([
      listProjectFlags(params.projectOne),
      listProjectFlags(params.projectTwo),
    ])

  project1.items.sort(sortItemsByName)
  project2.items.sort(sortItemsByName)

  return (
    <Layout>
      <CopyProjectToProjectHeader
        projectCopyFromName={project1Data.value.response.name}
        projectCopyToName={project2Data.value.response.name}
      />
      <CompareAvailableFlagsBetweenProjects
        projectOneItems={project1.items}
        projectOneName={project1Data.value.response.name}
        projectTwoItems={project2.items}
        projectTwoName={project2Data.value.response.name}
      />
      <FlagsComparisonTable
        items1={project1.items}
        items2={project2.items}
      ></FlagsComparisonTable>
    </Layout>
  )
}

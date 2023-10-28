import { FlagsComparisonTable } from '@/components/FlagsComparisonTable'
import { ListFlagsTypes } from '@/types/listFlags.types'
import Layout from '@/components/Layout'
import { CopyProjectToProjectHeader } from '@/components/CopyProjectToProjectHeader'
import { CompareAvailableFlagsBetweenProjects } from '@/components/CompareAvailableFlagsBetweenProjects'
import { listProjectFlags } from '@/app/api/listProjectFlags'
import { sortItemsByName } from '@/helpers/sortItemsByName'
import { getProject } from '@/app/api/getProject'

export async function generateMetadata({
  params,
}: {
  params: { projectOne: string; projectTwo: string }
}) {
  return {
    title: `LaunchDorkly | ${params.projectOne} ➡ ${params.projectTwo}`,
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
    !project1Data.value ||
    project2Data.status !== 'fulfilled' ||
    !project2Data.value
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
        projectCopyFromName={project1Data.value.name}
        projectCopyToName={project2Data.value.name}
      />
      <CompareAvailableFlagsBetweenProjects
        projectOneKey={params.projectOne}
        projectOneItems={project1.items}
        projectOneName={project1Data.value.name}
        projectTwoKey={params.projectTwo}
        projectTwoItems={project2.items}
        projectTwoName={project2Data.value.name}
      />
      <FlagsComparisonTable
        items1={project1.items}
        items2={project2.items}
      ></FlagsComparisonTable>
    </Layout>
  )
}

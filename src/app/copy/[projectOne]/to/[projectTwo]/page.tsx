import { ItemsProjects } from '@/components/ItemsProjects'
import { Item, ListFlags } from '@/types/list-flags'
import Layout from '@/components/Layout'
import { CopyProjectToProjectHeader } from '@/components/CopyProjectToProjectHeader'

const listFlags = async (projectKey: string) => {
  if (!process.env.LAUNCH_DARKLY_PERSONAL_ACCESS_TOKEN) {
    throw new Error('Need LD PAT')
  }
  const resp = await fetch(
    // date appended seemed to properly break cache responses
    `https://app.launchdarkly.com/api/v2/flags/${projectKey}?d=${new Date().getTime()}`,
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

  // if (resp.status === 404) {
  //   throw new Error('Could not update')
  // }

  const json = await resp.json()

  return {
    status: resp.status,
    response: json,
  }
}

const sortItems = (a: Item, b: Item) => {
  if (a.name > b.name) {
    return 1
  }

  if (b.name > a.name) {
    return -1
  }

  return 0
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
    return <>Could not find one project or other</>
  }

  const [project1, project2]: [ListFlags, ListFlags] = await Promise.all([
    listFlags(params.projectOne),
    listFlags(params.projectTwo),
  ])

  return (
    <Layout>
      <CopyProjectToProjectHeader
        projectCopyFromName={project1Data.value.response.name}
        projectCopyToName={project2Data.value.response.name}
      />
      <div className="flex flex-row">
        <ItemsProjects
          items1={project1.items.sort(sortItems)}
          items2={project2.items.sort(sortItems)}
        ></ItemsProjects>
      </div>
    </Layout>
  )
}

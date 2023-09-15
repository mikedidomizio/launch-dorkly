import Link from 'next/link'
import { CopyProjectsDropdowns } from '@/components/CopyProjectsDropdowns'
import Layout from '@/components/Layout'
import { ListProjects } from '@/types/listProjects.types'
import { sortItemsByName } from '@/helpers/sortItemsByName'

const listProjects = async (): Promise<ListProjects> => {
  if (!process.env.LAUNCH_DARKLY_PERSONAL_ACCESS_TOKEN) {
    throw new Error('Need LD PAT')
  }
  const resp = await fetch(
    // date appended seemed to properly break cache responses
    `https://app.launchdarkly.com/api/v2/projects`,
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

export default async function Page() {
  const projects = await listProjects()
  projects.items.sort(sortItemsByName)

  return (
    <Layout>
      <h2>Projects</h2>
      <ul>
        {projects.items.map((project) => {
          return (
            <li key={project.key}>
              <Link prefetch href={`/project/${project.key}`}>
                {project.name}
              </Link>
            </li>
          )
        })}
      </ul>

      <h2>Copy settings from one project to another</h2>
      <CopyProjectsDropdowns projects={projects.items} />
    </Layout>
  )
}

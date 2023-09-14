import Link from 'next/link'
import { CopyProjectsDropdowns } from '@/components/CopyProjectsDropdowns'
import Layout from '@/components/Layout'

const listProjects = async () => {
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

const sortProjectsByName = (a: any, b: any) => {
  if (a.name > b.name) {
    return 1
  }

  if (a.name < b.name) {
    return -1
  }

  return 0
}

export default async function Page() {
  const projects = await listProjects()
  projects.items.sort(sortProjectsByName)

  return (
    <Layout>
      <h2>Projects</h2>
      <ul>
        {projects.items.map((project: any) => {
          return (
            <li key={project.key}>
              <Link prefetch href={`/project/${project.key}`}>
                {project.name}
              </Link>
            </li>
          )
        })}
      </ul>

      <br />
      <h2>Copy settings from one project to another</h2>

      <CopyProjectsDropdowns projects={projects.items} />
    </Layout>
  )
}

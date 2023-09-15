import Link from 'next/link'
import { CopyProjectsDropdowns } from '@/components/CopyProjectsDropdowns'
import Layout from '@/components/Layout'
import { Project } from '@/types/listProjects.types'
import { sortItemsByName } from '@/helpers/sortItemsByName'
import { listProjects } from '@/app/api/listProjects'

export default async function Page() {
  const response = await listProjects()
  const projects = await response.json()
  projects.items.sort(sortItemsByName)

  return (
    <Layout>
      <h2>Projects</h2>
      <ul>
        {projects.items.map((project: Project) => {
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

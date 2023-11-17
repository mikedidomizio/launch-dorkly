import Link from 'next/link'
import { CopyProjectsDropdowns } from '@/components/CopyProjectsDropdowns'
import Layout from '@/components/Layout'
import { Project } from '@/types/listProjects.types'
import { sortItemsByName } from '@/helpers/sortItemsByName'
import { _listProjects } from '@/app/api/_listProjects'
import { redirect } from 'next/navigation'

export default async function Page() {
  const response = await _listProjects()

  if (response) {
    const projects = await response.json()
    projects.items.sort(sortItemsByName)

    return (
      <Layout>
        <h2 className="prose prose-lg">Projects</h2>
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

        <h2 className="prose prose-lg">
          Copy settings from one project to another
        </h2>
        <CopyProjectsDropdowns projects={projects.items} />
      </Layout>
    )
  }

  redirect('/start')
}

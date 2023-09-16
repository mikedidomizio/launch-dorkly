'use client'
import { useEffect, useState } from 'react'
import { redirect } from 'next/navigation'
import { Project } from '@/types/listProjects.types'

export const CopyProjectsDropdowns = ({
  projects,
}: {
  projects: Project[]
}) => {
  const [copyFrom, setCopyFrom] = useState<string>()
  const [copyTo, setCopyTo] = useState<string>()

  const [dropdownOneDisabled, setDropdownOneDisabled] = useState(false)
  const [dropdownTwoDisabled, setDropdownTwoDisabled] = useState(false)

  useEffect(() => {
    if (copyFrom && copyTo) {
      redirect(`/copy/${copyFrom}/to/${copyTo}`)
    }

    if (copyFrom !== '') {
      setDropdownOneDisabled(true)
    }

    if (copyTo !== '') {
      setDropdownTwoDisabled(true)
    }
  }, [copyFrom, copyTo])

  return (
    <div className="space-x-2 flex flex-row">
      <select
        className="select select-bordered w-full max-w-xs"
        onChange={(e) => setCopyFrom(e.target.value)}
        value={copyFrom}
      >
        <option disabled={dropdownOneDisabled} value="">
          Project to copy from
        </option>
        {projects.map((project) => {
          return (
            <option key={project.key} value={project.key}>
              {project.name}
            </option>
          )
        })}
      </select>
      <div className="flex self-center">➡</div>
      <select
        className="select select-bordered w-full max-w-xs"
        onChange={(e) => setCopyTo(e.target.value)}
        value={copyTo}
      >
        <option disabled={dropdownTwoDisabled} value="">
          Project to copy to
        </option>
        {projects.map((project) => {
          return (
            <option key={project.key} value={project.key}>
              {project.name}
            </option>
          )
        })}
      </select>
    </div>
  )
}

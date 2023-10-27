import { Item } from '@/types/listFlags.types'

import { WarningAlert } from '@/components/Alerts'
import { AddFlagButton } from '@/components/AddFlagButton'

function getMissingKeys(projectOneItems: Item[], projectTwoItems: Item[]) {
  const projectOneKeys = projectOneItems.map((item) => {
    return item.key
  })

  const projectTwoKeys = projectTwoItems.map((item) => {
    return item.key
  })

  const missingFromProjectTwo = projectOneKeys.filter((item) => {
    return !projectTwoKeys.includes(item)
  })

  const missingFromProjectOne = projectTwoKeys.filter((item) => {
    return !projectOneKeys.includes(item)
  })

  return {
    missingFromProjectOne,
    missingFromProjectTwo,
  }
}

const ListMissingFlags = ({
  existIn,
  missingFlags,
  projectName,
}: {
  existIn: string
  missingFlags: string[]
  projectName: string
}) => {
  if (!missingFlags.length) {
    return null
  }

  return (
    <WarningAlert>
      The following flag(s) exists in {existIn} and are missing in {projectName}
      <ul>
        {missingFlags.map((item) => {
          return (
            <li key={item}>
              {item} - <AddFlagButton>Add flag to {projectName}</AddFlagButton>
            </li>
          )
        })}
      </ul>
    </WarningAlert>
  )
}

export const CompareAvailableFlagsBetweenProjects = ({
  projectOneItems,
  projectOneName,
  projectTwoItems,
  projectTwoName,
}: {
  projectOneItems: Item[]
  projectOneName: string
  projectTwoItems: Item[]
  projectTwoName: string
}) => {
  const results = getMissingKeys(projectOneItems, projectTwoItems)

  return (
    <div className="grid gap-y-6">
      <ListMissingFlags
        projectName={projectOneName}
        existIn={projectTwoName}
        missingFlags={results.missingFromProjectOne}
      />
      <ListMissingFlags
        projectName={projectTwoName}
        existIn={projectOneName}
        missingFlags={results.missingFromProjectTwo}
      />
    </div>
  )
}

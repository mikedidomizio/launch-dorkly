import { Item } from '@/types/listFlags.types'

import { WarningAlert } from '@/components/Alerts'
import { CreateFlagButton } from '@/components/CreateFlagButton'

function getMissingItems(projectOneItems: Item[], projectTwoItems: Item[]) {
  const missingFromProjectTwo = projectOneItems.filter((item) => {
    return !projectTwoItems.find((i) => i.key === item.key)
  })

  const missingFromProjectOne = projectTwoItems.filter((item) => {
    return !projectOneItems.find((i) => i.key === item.key)
  })

  return {
    missingFromProjectOne,
    missingFromProjectTwo,
  }
}

const ListMissingFlags = ({
  existIn,
  missingFlags,
  projectKey,
  projectName,
}: {
  existIn: string
  missingFlags: Item[]
  projectKey: string
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
            <li key={item.key}>
              {item.key} -&nbsp;
              <CreateFlagButton
                flagParams={{
                  clientSideAvailability: item.clientSideAvailability,
                  customProperties: item.customProperties,
                  defaults: item.defaults,
                  description: item.description,
                  key: item.key,
                  name: item.name,
                  // although we could copy tags over with `item.tags`, this allows the user to determine if they want them copied over
                  tags: [],
                  temporary: item.temporary,
                  variations: item.variations,
                }}
                projectKey={projectKey}
              >
                Copy flag to {projectName}
              </CreateFlagButton>
            </li>
          )
        })}
      </ul>
    </WarningAlert>
  )
}

export const CompareAvailableFlagsBetweenProjects = ({
  projectOneKey,
  projectOneItems,
  projectOneName,
  projectTwoKey,
  projectTwoItems,
  projectTwoName,
}: {
  projectOneKey: string
  projectOneItems: Item[]
  projectOneName: string
  projectTwoKey: string
  projectTwoItems: Item[]
  projectTwoName: string
}) => {
  const results = getMissingItems(projectOneItems, projectTwoItems)

  return (
    <div className="grid gap-y-6">
      <ListMissingFlags
        projectKey={projectOneKey}
        projectName={projectOneName}
        existIn={projectTwoName}
        missingFlags={results.missingFromProjectOne}
      />
      <ListMissingFlags
        projectKey={projectTwoKey}
        projectName={projectTwoName}
        existIn={projectOneName}
        missingFlags={results.missingFromProjectTwo}
      />
    </div>
  )
}

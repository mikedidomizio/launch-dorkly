import { TargetsMatch } from '@/components/TargetsMatch'
import { Item } from '@/types/listFlags.types'
import { VariationMatch } from '@/components/VariationMatch'
import { DoesMatch } from '@/components/DoesMatch'
import { DoesNotMatch } from '@/components/DoesNotMatch'
import { ManageFlagDescription } from '@/components/ManageFlagDescription'
import { TagsMatch } from '@/components/TagsMatch'
import { ReactNode } from 'react'

const CannotCompare = ({ children }: { children: ReactNode | string }) => {
  return (
    <tr>
      <td>{children}</td>
    </tr>
  )
}

const getItemByKey = (items: Item[], key: string) => {
  return items.find((item) => item.key === key)
}

export const FlagsComparisonTable = ({
  items1,
  items2,
}: {
  items1: Item[]
  items2: Item[]
}) => {
  if (!items1.length) {
    return <>No flags for first project</>
  }

  const environments = Object.values(items1[0].environments).map(
    (environment) => environment._environmentName,
  )

  return (
    <table className="border-spacing-1.5 table">
      <thead>
        <tr>
          <th>Flag name</th>
          <th title="Blue means it exists in both.  Red means it is missing in the second project.  Lighter red is a flag missing from the first project">
            Tags
          </th>
          <th className="text-center" colSpan={3}>
            Compare metadata
          </th>
          <th>Flag key</th>
          <th className="text-center" colSpan={environments.length}>
            Targets
          </th>
          <th className="text-center" colSpan={2}>
            Variations
          </th>
        </tr>
        <tr className="text-center">
          <th></th>
          <th></th>
          <th className="text-center">Name</th>
          <th className="text-center">Description</th>
          <th className="text-center">Kind</th>
          <th></th>
          {environments.map((environment) => {
            return <th key={environment}>{environment}</th>
          })}
          <th>On</th>
          <th>Off</th>
        </tr>
      </thead>
      <tbody>
        {items1.map((item, index: number) => {
          const foundItem2 = getItemByKey(items2, item.key)
          let errorMessage: string | null = null

          if (!foundItem2) {
            errorMessage = `Flag does not exist for ${item.name}`
          }

          if (item.key !== foundItem2?.key && !errorMessage) {
            errorMessage = `Flag keys don't align for ${item.name}`
          }

          if (item.kind !== foundItem2?.kind && !errorMessage) {
            errorMessage = `Feature flag kind type does not match for ${item.name}`
          }

          if (errorMessage || !foundItem2) {
            return <CannotCompare key={item.key}>{errorMessage}</CannotCompare>
          }

          return (
            <tr key={item.key}>
              <td title={item.description}>{item.name}</td>
              <td>
                <TagsMatch
                  featureFlagKey={item.key}
                  projectFromTags={item.tags}
                  projectToTags={foundItem2.tags}
                />
              </td>
              <td className="text-center">
                {item.name === foundItem2.name ? (
                  <div title={`${item.name} - ${foundItem2.name}`}>
                    <DoesMatch />
                  </div>
                ) : (
                  <DoesNotMatch />
                )}
              </td>
              <td className="text-center">
                <span title={`${item.description} - ${foundItem2.description}`}>
                  {item.description === foundItem2.description ? (
                    <DoesMatch />
                  ) : (
                    <ManageFlagDescription
                      description={item.description}
                      featureFlagKey={item.key}
                    />
                  )}
                </span>
              </td>
              <td className="text-center">
                {item.kind === foundItem2.kind ? (
                  <DoesMatch />
                ) : (
                  <DoesNotMatch />
                )}
              </td>
              <td>{item.key}</td>
              <TargetsMatch item={item} items2={items2} />
              <VariationMatch item={item} items2={items2} />
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

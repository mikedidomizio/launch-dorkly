import { TargetsMatch } from '@/components/TargetsMatch'
import { Item } from '@/types/listFlags.types'
import { VariationMatch } from '@/components/VariationMatch'
import { DoesMatch } from '@/components/DoesMatch'
import { DoesNotMatch } from '@/components/DoesNotMatch'
import { ManageFlagDescription } from '@/components/ManageFlagDescription'
import { TagsMatch } from '@/components/TagsMatch'

const CannotCompare = ({ featureFlagKey }: { featureFlagKey: string }) => {
  return <>Could not compare for FF key: {featureFlagKey}</>
}

export const FlagsComparisonTable = ({
  items1,
  items2,
}: {
  items1: Item[]
  items2: Item[]
}) => {
  const environments = Object.values(items1[0].environments).map(
    (environment) => environment._environmentName,
  )

  // todo handle missing flags if one side is missing
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
          <th>Off</th>
          <th>On</th>
        </tr>
      </thead>
      <tbody>
        {items1.map((item, index: number) => {
          if (
            !items2[index] ||
            item.key !== items2[index].key ||
            item.kind !== items2[index].kind
          ) {
            return (
              <tr key={item.key}>
                <td>
                  <CannotCompare featureFlagKey={item.key} />
                </td>
              </tr>
            )
          }

          return (
            <tr key={item.key}>
              <td title={item.description}>{item.name}</td>
              <td>
                <TagsMatch
                  featureFlagKey={item.key}
                  projectFromTags={item.tags}
                  projectToTags={items2[index].tags}
                />
              </td>
              <td className="text-center">
                {item.name === items2[index].name ? (
                  <div title={`${item.name} - ${items2[index].name}`}>
                    <DoesMatch />
                  </div>
                ) : (
                  <DoesNotMatch />
                )}
              </td>
              <td className="text-center">
                <span
                  title={`${item.description} - ${items2[index].description}`}
                >
                  {item.description === items2[index].description ? (
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
                {item.kind === items2[index].kind ? (
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

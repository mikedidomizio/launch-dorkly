import { TargetsMatch } from '@/components/TargetsMatch'
import { Item } from '@/types/listFlags.types'
import { VariationMatch } from '@/components/VariationMatch'
import { ColouredBoolean } from '@/components/ColouredBoolean'
import { DoesMatch } from '@/components/DoesMatch'
import { DoesNotMatch } from '@/components/DoesNotMatch'

const flagsMatch = (item1: Item, item2: Item): boolean => {
  return item1.name === item2.name && item1.kind === item2.kind
}

const CannotCompare = ({ key }: { key: string }) => {
  return <>Could not compare for FF key: {key}</>
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
          <th>Name</th>
          <th>Description</th>
          <th>Kind</th>
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
            item.key !== items2[index].key ||
            item.kind !== items2[index].kind
          ) {
            return (
              <tr key={item.key}>
                <td>
                  <CannotCompare key={item.key} />
                </td>
              </tr>
            )
          }

          return (
            <tr key={item.key}>
              <td title={item.description}>{item.name}</td>
              <td>
                {item.name === items2[index].name ? (
                  <div title={`${item.name} - ${items2[index].name}`}>
                    <DoesMatch />
                  </div>
                ) : (
                  <DoesNotMatch />
                )}
              </td>
              <td>
                {item.description === items2[index].description ? (
                  <DoesMatch />
                ) : (
                  <div
                    title={`${item.description} - ${items2[index].description}`}
                  >
                    <DoesNotMatch />
                  </div>
                )}
              </td>
              <td>
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

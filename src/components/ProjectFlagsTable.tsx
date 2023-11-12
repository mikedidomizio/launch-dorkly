import { Item } from '@/types/listFlags.types'
import { Targets } from '@/components/Targets'
import { Variation } from '@/components/Variation'
import Link from 'next/link'

export const ProjectFlagsTable = ({
  items,
  projectName,
}: {
  items: Item[]
  projectName: string
}) => {
  if (!items[0]) {
    return <>No flags for this project</>
  }

  const environments = Object.values(items[0].environments).map(
    (environment) => environment._environmentName,
  )

  return (
    <table className="border-spacing-1.5 table">
      <thead>
        <tr>
          <th>Flag name</th>
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
          {environments.map((environment) => {
            return <th key={environment}>{environment}</th>
          })}
          <th>On</th>
          <th>Off</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, index: number) => {
          return (
            <tr key={index}>
              <td>
                <Link href={`${projectName}/${item.name}`}>{item.name}</Link>
              </td>
              <td>{item.key}</td>
              <Targets item={item} />
              <Variation item={item} />
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

import { ComponentType } from 'react'
import { clsx } from 'clsx'
import { Environment } from '@/types/listFlags.types'

export const EnvironmentsColumns = ({
  Column,
  environments,
}: {
  Column: ComponentType<{
    environmentKey: string
    values: any
  }>
  environments: Record<string, Environment>
}) => {
  const environmentsEntries = Object.entries(environments)

  return (
    <>
      {environmentsEntries.map(([environmentKey, values], index) => {
        return (
          <td
            className={clsx(
              'text-center',
              index % 2 === 0 ? 'bg-gray-100' : null,
              index === 0 ? 'border-gray-300 border-l-[1px]' : null,
              environmentsEntries.length - 1 === index
                ? 'border-gray-300 border-r-[1px]'
                : null,
            )}
            key={index}
          >
            <Column environmentKey={environmentKey} values={values} />
          </td>
        )
      })}
    </>
  )
}

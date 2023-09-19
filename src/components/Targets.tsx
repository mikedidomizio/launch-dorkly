'use client'
import { Item } from '@/types/listFlags.types'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { clsx } from 'clsx'

export const Targets = ({ item }: { item: Item }) => {
  const [itemState, setItemState] = useState(item)
  const params = useParams()

  if (!params.project) {
    throw new Error('expects to be under route with parameter')
  }

  const toggleFlag = async (
    environment: string,
    featureFlagKey: string,
    value: boolean,
  ) => {
    const response = await fetch('/api/update-target', {
      method: 'PATCH',
      body: JSON.stringify({
        environment,
        featureFlagKey,
        project: params.project,
        value,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })

    if (response.status !== 200) {
      throw new Error('Could not update')
    }

    // update local view
    setItemState({
      ...itemState,
      environments: {
        ...itemState.environments,
        [environment]: {
          ...itemState.environments[environment],
          on: value,
        },
      },
    })
  }

  const environments = Object.entries(itemState.environments)

  return (
    <>
      {environments.map(([environmentKey, values], index) => {
        return (
          <td
            className={clsx(
              'text-center',
              index % 2 === 0 ? 'bg-gray-100' : null,
              index === 0 ? 'border-gray-300 border-l-[1px]' : null,
              environments.length - 1 === index
                ? 'border-gray-300 border-r-[1px]'
                : null,
            )}
            key={environmentKey}
          >
            <input
              type="checkbox"
              className="toggle toggle-success"
              checked={values.on}
              onChange={() =>
                toggleFlag(environmentKey, itemState.key, !values.on)
              }
            />
          </td>
        )
      })}
    </>
  )
}

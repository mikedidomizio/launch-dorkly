'use client'
import { useState } from 'react'
import { Item } from '@/types/listFlags.types'
import { DoesNotMatch } from '@/components/DoesNotMatch'
import { DoesMatch } from '@/components/DoesMatch'
import { useParams } from 'next/navigation'
import { clsx } from 'clsx'

export const TargetsMatch = ({
  item,
  items2,
}: {
  item: Item
  items2: Item[]
}) => {
  const { projectTwo, test } = useParams()
  const [items2State, setItems2State] = useState(items2)

  if (!projectTwo) {
    throw new Error('expects to be under route with parameter')
  }

  const handleMatchFirstProject = async (
    environment: string,
    featureFlagKey: string,
    value: boolean,
  ) => {
    const response = await fetch('/api/update-target', {
      method: 'PATCH',
      body: JSON.stringify({
        environment,
        featureFlagKey,
        project: projectTwo,
        value,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })

    if (response.status !== 200) {
      throw new Error('Could not update')
    }

    // update the state to reflect the new changes, this is just handled locally
    const newMappedValues = items2State.map((item) => {
      if (item.key === featureFlagKey) {
        item.environments[environment].on = value
      }

      return item
    })

    setItems2State(newMappedValues)
  }

  // todo not efficient at all but works
  const getOnValue = (environmentKey: string, featureFlagKey: string) => {
    const filteredItem = items2State.find((item) => {
      return item.key === featureFlagKey
    })

    if (filteredItem) {
      return filteredItem.environments[environmentKey].on
    }

    throw new Error('Could not find item')
  }

  const environments = Object.entries(item.environments)

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
            {values.on === getOnValue(environmentKey, item.key) ? (
              <DoesMatch />
            ) : (
              <DoesNotMatch
                onClick={() =>
                  handleMatchFirstProject(environmentKey, item.key, values.on)
                }
              />
            )}
          </td>
        )
      })}
    </>
  )
}

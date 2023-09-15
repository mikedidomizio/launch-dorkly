'use client'
import { Item } from '@/types/listFlags.types'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { ColouredBoolean } from '@/components/ColouredBoolean'

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

  return (
    <>
      {Object.entries(itemState.environments).map(
        ([environmentKey, values]) => {
          return (
            <td className="text-center" key={environmentKey}>
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
        },
      )}
    </>
  )
}

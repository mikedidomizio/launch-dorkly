'use client'
import { useState } from 'react'
import { Item } from '@/types/listFlags.types'
import { DoesNotMatch } from '@/components/DoesNotMatch'
import { DoesMatch } from '@/components/DoesMatch'
import { useParams } from 'next/navigation'
import { EnvironmentsColumns } from '@/components/EnvironmentsColumns'
import { updateTarget } from '@/app/api/updateTarget'
import toast from 'react-hot-toast'
import { fetchToPromise } from '@/helpers/fetchToPromise'
import { Response } from 'next/dist/compiled/@edge-runtime/primitives'
import { handleLdErrorResponse } from '@/helpers/handleLdErrorResponse'

export const TargetsMatch = ({
  item,
  items2,
}: {
  item: Item
  items2: Item[]
}) => {
  const { projectTwo } = useParams()
  const [items2State, setItems2State] = useState(items2)

  if (!projectTwo) {
    throw new Error('expects to be under route with parameter')
  }

  const handleMatchFirstProject = async (
    environment: string,
    featureFlagKey: string,
    value: boolean,
  ) => {
    await toast.promise(
      fetchToPromise(
        updateTarget(environment, featureFlagKey, projectTwo as string, value),
      ),
      {
        loading: 'Changing',
        success: `"${featureFlagKey}" is now "${value}" in "${environment}"`,
        error: handleLdErrorResponse,
      },
      {
        position: 'bottom-right',
      },
    )

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

  return (
    <>
      <EnvironmentsColumns
        environments={item.environments}
        column={(environmentKey, values) => {
          return values.on === getOnValue(environmentKey, item.key) ? (
            <DoesMatch />
          ) : (
            <DoesNotMatch
              onClick={() =>
                handleMatchFirstProject(environmentKey, item.key, values.on)
              }
            />
          )
        }}
      ></EnvironmentsColumns>
    </>
  )
}

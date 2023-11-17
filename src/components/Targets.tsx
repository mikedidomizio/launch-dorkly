'use client'
import { Item } from '@/types/listFlags.types'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { EnvironmentsColumns } from '@/components/EnvironmentsColumns'
import { _updateTarget } from '@/app/api/_updateTarget'
import toast from 'react-hot-toast'
import { fetchToPromise } from '@/helpers/fetchToPromise'
import { handleLdErrorResponse } from '@/helpers/handleLdErrorResponse'

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
    await toast.promise(
      fetchToPromise(
        _updateTarget(
          environment,
          featureFlagKey,
          params.project as string,
          value,
        ),
        [200],
      ),
      {
        loading: 'Changing',
        success: `"${featureFlagKey}" is now "${value}" in "${itemState.environments[environment]._environmentName}"`,
        error: handleLdErrorResponse,
      },
      {
        position: 'bottom-right',
      },
    )

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
      <EnvironmentsColumns
        environments={itemState.environments}
        Column={({
          environmentKey,
          values,
        }: {
          environmentKey: string
          values: { on: boolean; off: boolean }
        }) => {
          return (
            <input
              type="checkbox"
              className="toggle toggle-success"
              checked={values.on}
              onChange={() =>
                toggleFlag(environmentKey, itemState.key, !values.on)
              }
            />
          )
        }}
      ></EnvironmentsColumns>
    </>
  )
}

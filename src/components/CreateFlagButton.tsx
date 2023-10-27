'use client'
import { ReactNode } from 'react'
import { CreateFlagParams } from '@/types/createFlag.types'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { fetchToPromise } from '@/helpers/fetchToPromise'
import { updateTarget } from '@/app/api/updateTarget'
import { handleLdErrorResponse } from '@/helpers/handleLdErrorResponse'

export const CreateFlagButton = ({
  children,
  flagParams,
  projectKey,
}: {
  children: ReactNode
  flagParams: CreateFlagParams
  projectKey: string
}) => {
  const router = useRouter()

  const handleAddFlag = async () => {
    await toast.promise(
      fetchToPromise(
        fetch(`/api/create-flag/${projectKey}`, {
          method: 'POST',
          body: JSON.stringify(flagParams),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        }),
        201,
      ),
      {
        loading: 'Changing',
        success: () => {
          // todo should remove it from the list but the table needs to be told to update as well
          router.refresh()
          return ''
        },
        error: handleLdErrorResponse,
      },
      {
        position: 'bottom-right',
      },
    )
  }

  return (
    <button className="btn btn-primary btn-xs" onClick={handleAddFlag}>
      {children}
    </button>
  )
}

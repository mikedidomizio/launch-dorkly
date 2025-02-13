'use client'
import { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { fetchToPromise } from '@/helpers/fetchToPromise'
import { handleLdErrorResponse } from '@/helpers/handleLdErrorResponse'

export const CopyAllFlagsButton = ({
                                   children,
                                   projectToCopyFrom,
                                   projectToCopyTo,
                                 }: {
  children: ReactNode
  projectToCopyFrom: string,
  projectToCopyTo: string
}) => {
  const router = useRouter()

  const handleAddFlag = async () => {
    await fetch(`/api/copy-flags-from-project-to-project`, {
      method: 'POST',
      body: JSON.stringify({
        projectToCopyFrom,
        projectToCopyTo
      }),
    }),

    await toast.promise(
      fetchToPromise(
        fetch(`/api/copy-flags-from-project-to-project`, {
          method: 'POST',
          body: JSON.stringify(formData),
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }),
        [201],
      ),
      {
        loading: 'Copying flags, this may take a few mins',
        success: () => {
          // todo should remove it from the list but the table needs to be told to update as well
          router.refresh()
          return 'Refreshing page'
        },
        error: (e) => {
          // if we get a conflict error, it's possibly because the flag exists for this project
          if (e.status === 409) {
            return '409: Cannot create flag, possibly exists or archived. Flag can only be created once it does not exist'
          }

          return handleLdErrorResponse(e)
        },
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

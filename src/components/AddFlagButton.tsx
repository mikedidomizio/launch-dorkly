'use client'
import { ReactNode } from 'react'
import { CreateFlagParams } from '@/types/createFlag.types'

export const AddFlagButton = ({
  children,
  flagParams,
}: {
  children: ReactNode
  flagParams: CreateFlagParams
}) => {
  const handleAddFlag = async () => {
    const response = await fetch('/api/create-flag', {
      method: 'POST',
      body: JSON.stringify(flagParams),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })

    console.log(response)
  }

  return (
    <button className="btn btn-primary btn-xs" onClick={handleAddFlag}>
      {children}
    </button>
  )
}

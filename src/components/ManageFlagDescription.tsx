'use client'
import { DoesNotMatch } from '@/components/DoesNotMatch'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { DoesMatch } from '@/components/DoesMatch'

export const ManageFlagDescription = ({
  description,
  featureFlagKey,
}: {
  description: string
  featureFlagKey: string
}) => {
  const params = useParams()
  const [synced, setSynced] = useState(false)

  if (!params.projectTwo) {
    throw new Error('Routing is busted for this component, needs projectTwo')
  }
  const updateDescriptionOfFeatureFlag = async () => {
    const response = await fetch('/api/update-description', {
      method: 'PATCH',
      body: JSON.stringify({
        description,
        featureFlagKey,
        projectKey: params.projectTwo,
      }),
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
    })

    if (response.status === 200) {
      setSynced(true)
    }
  }

  if (synced) {
    return <DoesMatch />
  } else {
    return <DoesNotMatch onClick={updateDescriptionOfFeatureFlag} />
  }
}

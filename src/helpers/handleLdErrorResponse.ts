import { Response } from 'next/dist/compiled/@edge-runtime/primitives'

export const handleLdErrorResponse = (response: Response) => {
  if (response.status === 403) {
    return '403: Does this LD token have the correct permissions?'
  }

  return 'Error making update'
}

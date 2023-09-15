import { ReactNode } from 'react'

export const ColouredBoolean = ({
  bool,
  children,
}: {
  bool: string | boolean
  children: ReactNode
}) => {
  let cls = 'text-black'
  if (bool === 'true' || bool) {
    cls = 'text-green-500'
  } else if (bool === 'false' || !bool) {
    cls = 'text-gray-500'
  }

  return <span className={cls}>{children}</span>
}

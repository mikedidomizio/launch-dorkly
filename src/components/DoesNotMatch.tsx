import { MouseEventHandler } from 'react'

export const DoesNotMatch = ({
  onClick,
}: {
  onClick?: MouseEventHandler<HTMLButtonElement>
}) => {
  return <button onClick={onClick}>❌</button>
}

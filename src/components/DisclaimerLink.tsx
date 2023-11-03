import Link from 'next/link'

export const DisclaimerLink = ({
  children = 'Disclaimer',
}: {
  children?: string
}) => {
  return (
    <Link
      href="https://github.com/mikedidomizio/launchdorkly?tab=readme-ov-file#%EF%B8%8F-disclaimer"
      target="_blank"
    >
      {children}
    </Link>
  )
}

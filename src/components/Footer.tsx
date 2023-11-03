import Link from 'next/link'
import { GitHubImage } from '@/components/GitHubLink'
import { DisclaimerLink } from '@/components/DisclaimerLink'

export const Footer = () => {
  return (
    <footer className="p-12">
      <div className="flex">
        <Link
          className="mr-2"
          target="_blank"
          href="https://github.com/mikedidomizio/launchdorkly"
        >
          <GitHubImage width={24} height={24.5} />
        </Link>
        <DisclaimerLink />
      </div>
    </footer>
  )
}

import { getCommitSha } from '@/helpers/getCommitSha'
import Link from 'next/link'
import { GitHubImage } from '@/components/GitHubLink'

export const Footer = () => {
  const sha = getCommitSha()

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
        {sha ? (
          <>
            <Link
              href={`https://github.com/mikedidomizio/launchdorkly/commit/${sha}`}
              target="_blank"
            >
              Latest Commit
            </Link>
          </>
        ) : (
          'Running locally or could not get SHA'
        )}
      </div>
    </footer>
  )
}

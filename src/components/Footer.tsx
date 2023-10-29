import { getCommitSha } from '@/helpers/getCommitSha'

export const Footer = () => {
  const sha = getCommitSha()

  return (
    <footer className="p-12">
      {sha ? (
        <a
          href={`https://github.com/mikedidomizio/launchdorkly/commit/${sha}`}
          target="_blank"
        >
          {sha}
        </a>
      ) : (
        'Running locally or could not get SHA'
      )}
    </footer>
  )
}

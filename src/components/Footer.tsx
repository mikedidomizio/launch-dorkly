import { getCommitSha } from '@/helpers/getCommitSha'

export const Footer = () => {
  return <footer className="p-12">{getCommitSha()}</footer>
}

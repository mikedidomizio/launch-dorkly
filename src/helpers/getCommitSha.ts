export const getCommitSha = (): string | null => {
  const { VERCEL_GIT_COMMIT_SHA } = process.env

  if (VERCEL_GIT_COMMIT_SHA) {
    return VERCEL_GIT_COMMIT_SHA
  }

  return null
}

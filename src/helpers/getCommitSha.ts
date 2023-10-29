export const getCommitSha = (): string => {
  const { NEXT_PUBLIC_GIT_COMMIT_SHA } = process.env

  if (NEXT_PUBLIC_GIT_COMMIT_SHA) {
    return NEXT_PUBLIC_GIT_COMMIT_SHA
  }

  return 'Running locally or could not get SHA'
}

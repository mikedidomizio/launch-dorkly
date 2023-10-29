import Image from 'next/image'

export const GitHubImage = ({
  width = 49,
  height = 48,
}: {
  width?: number
  height?: number
}) => {
  return (
    <Image
      className="m-0 p-0"
      src="/github-mark.png"
      alt="Link to GitHub project"
      width={width}
      height={height}
    />
  )
}

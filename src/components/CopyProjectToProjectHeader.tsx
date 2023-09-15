export const CopyProjectToProjectHeader = ({
  projectCopyFromName,
  projectCopyToName,
}: {
  projectCopyFromName: string
  projectCopyToName: string
}) => {
  return (
    <h2>
      {projectCopyFromName} ➡ {projectCopyToName}
    </h2>
  )
}

export const CopyProjectToProjectHeader = ({
  projectCopyFromName,
  projectCopyToName,
}: {
  projectCopyFromName: string
  projectCopyToName: string
}) => {
  return (
    <h2 className="prose prose-lg">
      {projectCopyFromName} ➡ {projectCopyToName}
    </h2>
  )
}

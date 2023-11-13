import { listAuditLog } from '@/app/api/listAuditLog'
import { AuditLog } from '@/types/auditLog.types'

export const AuditHistory = async ({
  projectKey,
  featureFlag,
}: {
  projectKey: string
  featureFlag: string
}) => {
  const auditLog = await listAuditLog(projectKey, featureFlag)
  const history: AuditLog = await auditLog.json()

  return (
    <>
      {history.items.map((item) => {
        return <div key={item._id}>{item.title}</div>
      })}
    </>
  )
}

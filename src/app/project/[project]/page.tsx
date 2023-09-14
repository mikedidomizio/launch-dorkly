export default async function Page({ params }: { params: { project: string }}) {
    return (
        <main className="min-h-screen flex-col p-24">
            {params.project}
        </main>
    )
}

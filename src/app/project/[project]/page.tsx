import Layout from "@/components/Layout";

export default async function Page({ params }: { params: { project: string }}) {
    return (
        <Layout>
            {params.project}
        </Layout>
    )
}

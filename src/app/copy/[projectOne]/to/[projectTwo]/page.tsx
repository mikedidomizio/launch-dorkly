import {ItemsProjects} from "@/components/ItemsProjects";
import {Item, ListFlags} from "@/types/list-flags";

const listFlags = async(projectKey: string) => {
    if (!process.env.LAUNCH_DARKLY_PERSONAL_ACCESS_TOKEN) {
        throw new Error('Need LD PAT')
    }
    const resp = await fetch(
        // date appended seemed to properly break cache responses
        `https://app.launchdarkly.com/api/v2/flags/${projectKey}?d=${new Date().getTime()}`,
        {
            method: 'GET',
            headers: {
                Authorization: process.env.LAUNCH_DARKLY_PERSONAL_ACCESS_TOKEN,
                'cache-control': 'no-cache',
                cache: 'no-store'
            }
        }
    );

    return resp.json();
}

const sortItems = (a: Item, b: Item) => {
    if(a.name > b.name) {
        return 1
    }

    if (b.name > a.name) {
        return -1
    }

    return 0
}

export default async function Page({ params }: { params: { projectOne: string, projectTwo: string }}) {
  const [project1, project2]: [ListFlags, ListFlags] = await Promise.all([listFlags(params.projectOne), listFlags(params.projectTwo)])

  return (
    <main className="min-h-screen flex-col p-24">
        <div className="flex flex-row">
            <ItemsProjects items1={project1.items.sort(sortItems)} items2={project2.items.sort(sortItems)} ></ItemsProjects>
        </div>
    </main>
  )
}

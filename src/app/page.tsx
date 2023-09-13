async function listFlagsProjectOne() {
    if (!process.env.LAUNCH_DARKLY_PERSONAL_ACCESS_TOKEN || !process.env.LD_PROJECT_ONE) {
        throw new Error('Need LD PAT')
    }

    return listFlags(process.env.LD_PROJECT_ONE)
}

async function listFlagsProjectTwo() {
    if (!process.env.LAUNCH_DARKLY_PERSONAL_ACCESS_TOKEN || !process.env.LD_PROJECT_TWO) {
        throw new Error('Need LD PAT')
    }

    return listFlags(process.env.LD_PROJECT_TWO)
}

const listFlags = async(projectKey: string) => {
    if (!process.env.LAUNCH_DARKLY_PERSONAL_ACCESS_TOKEN) {
        throw new Error('Need LD PAT')
    }
    const resp = await fetch(
        `https://app.launchdarkly.com/api/v2/flags/${projectKey}`,
        {
            method: 'GET',
            headers: {
                Authorization: process.env.LAUNCH_DARKLY_PERSONAL_ACCESS_TOKEN
            }
        }
    );

    return resp.json();
}

const Items = ({items} : any) => {
    return <table>
        {items.map((item: any, index: number) => {
            return <tr key={index}><td>
                {item.name}
            </td>
            <td>
                {item.kind}
            </td>
            </tr>
        })}
    </table>
}

const sortItems = (a: any, b: any) => {
    if(a.name > b.name) {
        return 1
    }

    if (b.name > a.name) {
        return -1
    }

    return 0
}

export default async function Home() {
  const project1 = await listFlagsProjectOne()
  const project2 = await listFlagsProjectTwo()

  return (
    <main className="min-h-screen flex-col p-24">
        <div className="flex flex-row">
            <div>
                Project One

                <Items items={project1.items.sort(sortItems)} />
            </div>
            <div>
                Project Two

                <Items items={project2.items.sort(sortItems)} />
            </div>
        </div>
    </main>
  )
}

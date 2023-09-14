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
                <td>
                    {Object.values(item.environments).map((environment: any) => {
                        return <>
                            <b>{environment._environmentName}</b>
                            <b>{'' + environment.on}</b>
                        </>
                    })}
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

const flagsMatch = (item1: any, item2: any): boolean => {
    return item1.name === item2.name && item1.kind === item2.kind
}

const valuesMatch = (item1Val: any, item2Val: any): boolean => {
    return item1Val === item2Val
}

const ItemsProjects = ({ items1, items2}: any) => {

    console.log(items2[0].environments)
    // todo handle missing flags if one side is missing
    return <table className="border-spacing-1.5">
        <tr>
            <th>Flag name</th>
            <th>Name and Kind match</th>
            <th colSpan={6}>Environments</th>
        </tr>
        {items1.map((item: any, index: number) => {
            return <tr key={index}>
                <td>
                    {item.name}
                </td>
                <td>
                    {'' + flagsMatch(item, items2[index])}
                </td>
                {Object.entries(item.environments).map(([ key, values ]: any) => {
                    return <td key={key}>
                        <b>{values._environmentName}</b>
                        <br/>
                        {valuesMatch(values.on, items2[0].environments[key].on) ? <>✅</> : <span title={`${values.on} - ${items2[0].environments[key].on}`}>❌</span>}
                    </td>
                })}
            </tr>
        })}
    </table>
}

export default async function Home() {
  const project1 = await listFlagsProjectOne()
  const project2 = await listFlagsProjectTwo()

  return (
    <main className="min-h-screen flex-col p-24">
        <div className="flex flex-row">
            <ItemsProjects items1={project1.items.sort(sortItems)} items2={project2.items.sort(sortItems)} ></ItemsProjects>
        </div>
    </main>
  )
}

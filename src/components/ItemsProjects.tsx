import {Targets} from "@/components/Targets";

const flagsMatch = (item1: any, item2: any): boolean => {
    return item1.name === item2.name && item1.kind === item2.kind
}

export const ItemsProjects = ({ items1, items2}: any) => {
    // todo handle missing flags if one side is missing
    return <table className="border-spacing-1.5">
        <thead>
            <tr>
                <th>Flag name</th>
                <th>Flag key</th>
                <th>Name and Kind match</th>
                <th colSpan={6}>Targets</th>
            </tr>
        </thead>
        <tbody>
        {items1.map((item: any, index: number) => {
            return <tr key={index}>
                <td>
                    {item.name}
                </td>
                <td>{item.key}</td>
                <td>
                    {'' + flagsMatch(item, items2[index])}
                </td>
                <Targets item={item} items2={items2} />
            </tr>
        })}
        </tbody>
    </table>
}

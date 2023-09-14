import {Targets} from "@/components/Targets";
import {Item} from "@/types/list-flags";
import {Variation} from "@/components/Variation";

const flagsMatch = (item1: Item, item2: Item): boolean => {
    return item1.name === item2.name && item1.kind === item2.kind
}

export const ItemsProjects = ({ items1, items2}: { items1: Item[], items2: Item[] }) => {
    const environments = Object.values(items1[0].environments).map(environment => environment._environmentName)

    // todo handle missing flags if one side is missing
    return <table className="border-spacing-1.5">
        <thead>
            <tr>
                <th>Flag name</th>
                <th>Flag key</th>
                <th>Name and Kind match</th>
                <th colSpan={environments.length}>Targets</th>
                <th colSpan={2}>Variations</th>
            </tr>
            <tr>
                <th></th>
                <th></th>
                <th></th>
                {environments.map(environment => {
                        return <th>{environment}</th>
                })}
                <th>Off</th>
                <th>On</th>
            </tr>
        </thead>
        <tbody>
        {items1.map((item, index: number) => {
            return <tr key={index}>
                <td>
                    {item.name}
                </td>
                <td>{item.key}</td>
                <td>
                    {'' + flagsMatch(item, items2[index])}
                </td>
                <Targets item={item} items2={items2} />
                <Variation item={item} items2={items2} />
            </tr>
        })}
        </tbody>
    </table>
}

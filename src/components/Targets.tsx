'use client'
import {useState} from "react";
import {Item} from "@/types/list-flags";

const valuesMatch = (item1Val: boolean, item2Val: boolean): boolean => {
    return item1Val === item2Val
}

export const Targets = ({ item, items2 }: {  item: Item, items2: Item[] }) => {
    const [items2State, setItems2State] = useState(items2)

    const handleMatchFirstProject = async(environment: string, featureFlagKey: string, value: boolean) => {
        const response = await fetch('/api/update-target', {
            method: 'PATCH',
            body: JSON.stringify({
                environment,
                featureFlagKey,
                value,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })

        if (response.status !== 200) {
            throw new Error('Could not update')
        }

        // update the state to reflect the new changes, this is just handled locally
        const newMappedValues = items2State.map((item) => {
            if (item.key === featureFlagKey) {
                item.environments[environment].on = value
            }

            return item
        })

        setItems2State(newMappedValues)
    }

    // todo not efficient at all but works
    const getOnValue = (environmentKey: string, featureFlagKey: string) => {
        const filteredItem = items2State.find((item) => {
            return item.key === featureFlagKey
        })

        if (filteredItem) {
            return filteredItem.environments[environmentKey].on
        }

        throw new Error('Could not find item')
    }

    return <>
        {Object.entries(item.environments).map(([ environmentKey, values ]) => {
            return <td key={environmentKey}>
                <b>{values._environmentName}</b>
                <br/>
                {valuesMatch(values.on, getOnValue(environmentKey, item.key)) ? <button>✅</button> : <button
                    onClick={() => handleMatchFirstProject(environmentKey, item.key, values.on)}>❌</button>}
        </td>
        })}
    </>
}

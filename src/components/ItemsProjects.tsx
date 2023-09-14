'use client'

import {useState} from "react";

const flagsMatch = (item1: any, item2: any): boolean => {
    return item1.name === item2.name && item1.kind === item2.kind
}

const valuesMatch = (item1Val: any, item2Val: any): boolean => {
    return item1Val === item2Val
}

export const ItemsProjects = ({ items1, items2}: any) => {
    const [items2State, setItems2State] = useState(items2)

    const handleMatchFirstProject = async(environment: string, featureFlagKey: string, value: any) => {
        const response = await fetch('/api/update-route', {
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
        const newMappedValues = items2State.map((item: any) => {
            if (item.key === featureFlagKey) {
                item.environments[environment].on = value
            }

            return item
        })

        setItems2State(newMappedValues)
    }


    // todo handle missing flags if one side is missing
    return <table className="border-spacing-1.5">
        <thead>
            <tr>
                <th>Flag name</th>
                <th>Flag key</th>
                <th>Name and Kind match</th>
                <th colSpan={6}>Environments</th>
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
                    {'' + flagsMatch(item, items2State[index])}
                </td>
                {Object.entries(item.environments).map(([ environmentKey, values ]: any) => {
                    return <td key={environmentKey}>
                        <b>{values._environmentName}</b>
                        <br/>
                        {valuesMatch(values.on, items2State[index].environments[environmentKey].on) ? <button title={`${values.on} - ${items2State[index].environments[environmentKey].on}`}>✅</button> : <button
                            onClick={() => handleMatchFirstProject(environmentKey, item.key, values.on)} title={`${values.on} - ${items2State[index].environments[environmentKey].on}`}>❌</button>}
                    </td>
                })}
            </tr>
        })}
        </tbody>
    </table>
}

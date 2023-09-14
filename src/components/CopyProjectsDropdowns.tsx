'use client'
import {useEffect, useState} from "react";
import {redirect} from "next/navigation";

export const CopyProjectsDropdowns = ({ projects }: any) => {
    const [copyFrom, setCopyFrom] = useState<string | null>(null)
    const [copyTo, setCopyTo] = useState<string | null>(null)

    useEffect(() => {
        if (copyFrom && copyTo) {
            redirect(`/copy/${copyFrom}/to/${copyTo}`)
        }
    }, [copyFrom, copyTo])

    return <>
        Project to copy from:
        <select onChange={(e) => setCopyFrom(e.target.value)}>
            {projects.map((project: any) => {
                return <option key={project.key} value={project.key}>{project.name}</option>
            })}
        </select>

        <br/>
        Project to copy to:
        <select onChange={(e) => setCopyTo(e.target.value)}>
            {projects.map((project: any) => {
                return <option key={project.key} value={project.key}>{project.name}</option>
            })}
        </select>
    </>
}

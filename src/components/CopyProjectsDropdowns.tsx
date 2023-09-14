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
        <select className="select select-bordered w-full max-w-xs"  onChange={(e) => setCopyFrom(e.target.value)}>
            <option disabled selected>Project to copy from</option>
            {projects.map((project: any) => {
                return <option key={project.key} value={project.key}>{project.name}</option>
            })}
        </select>

        <br/>

        <select className="select select-bordered w-full max-w-xs"  onChange={(e) => setCopyTo(e.target.value)}>
            <option disabled selected>Project to copy to</option>
            {projects.map((project: any) => {
                return <option key={project.key} value={project.key}>{project.name}</option>
            })}
        </select>

    </>
}

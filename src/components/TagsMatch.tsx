'use client'
import { useParams } from 'next/navigation'
import { useState } from 'react'

const getMissingTags = (tags1: string[], tags2: string[]) => {
  let tagsComparison = tags1.reduce(
    (acc, cur) => {
      if (tags2.includes(cur)) {
        acc.exists.push(cur)
      } else {
        acc.missingInSecond.push(cur)
      }

      return acc
    },
    {
      exists: [],
      missingInFirst: [],
      missingInSecond: [],
    } as {
      exists: string[]
      missingInFirst: string[]
      missingInSecond: string[]
    },
  )

  tagsComparison = tags2.reduce((acc, cur) => {
    if (!tags1.includes(cur)) {
      acc.missingInFirst.push(cur)
    }

    return acc
  }, tagsComparison)

  return tagsComparison
}

/**
 * Renders which tags match and don't match between the two projects
 */
export const TagsMatch = ({
  featureFlagKey,
  projectFromTags,
  projectToTags,
}: {
  featureFlagKey: string
  projectFromTags: string[]
  projectToTags: string[]
}) => {
  const { projectTwo } = useParams()
  const tagsSeparated = getMissingTags(projectFromTags, projectToTags)

  const [tagsSeparatedState, setTagsSeparatedState] = useState(tagsSeparated)

  if (!projectTwo) {
    throw new Error(
      'using client component and useParams and parameter missing',
    )
  }

  const addTagToSecondProject = async (tagToAdd: string) => {
    const response = await fetch('/api/add-tags', {
      method: 'PATCH',
      body: JSON.stringify({
        featureFlagKey,
        projectKey: projectTwo,
        tags: [tagToAdd],
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })

    if (response.status === 200) {
      const tempExists = tagsSeparatedState.exists
      tempExists.push(tagToAdd)

      setTagsSeparatedState({
        exists: tempExists,
        missingInFirst: tagsSeparatedState.missingInFirst,
        missingInSecond: tagsSeparatedState.missingInSecond.filter(
          (tag) => tag !== tagToAdd,
        ),
      })
    }
  }

  return (
    <>
      {tagsSeparatedState.exists.map((matchingTag) => {
        return (
          <div
            title="This tag exists in both projects"
            key={matchingTag}
            className="badge badge-primary"
          >
            {matchingTag}
          </div>
        )
      })}

      <br />

      {tagsSeparatedState.missingInSecond.map((tagMissing) => {
        return (
          <button
            key={tagMissing}
            onClick={() => addTagToSecondProject(tagMissing)}
          >
            <span
              title="This tag is missing in the second project"
              className="badge bg-red-600 text-white"
            >
              {tagMissing}
            </span>
          </button>
        )
      })}

      {/*<br />*/}
      {/*{tagsSeparatedState.missingInFirst.map((tagMissing) => {*/}
      {/*  return (*/}
      {/*    <div*/}
      {/*      title="This tag is missing in the first project"*/}
      {/*      key={tagMissing}*/}
      {/*      className="badge bg-red-400 text-white"*/}
      {/*    >*/}
      {/*      {tagMissing}*/}
      {/*    </div>*/}
      {/*  )*/}
      {/*})}*/}
    </>
  )
}

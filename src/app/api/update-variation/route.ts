import {NextResponse} from "next/server";

export async function PATCH(req: Request) {
    if (!process.env.LAUNCH_DARKLY_PERSONAL_ACCESS_TOKEN) {
        return NextResponse.json({ error: 'Error' }, { status: 500 })
    }

    const { featureFlagKey, variation, value } = await req.json()

    if (variation !== 'onVariationValue' && variation !== 'offVariationValue') {
        return NextResponse.json({ error: 'Bad request' }, { status: 400 })
    }

    const resp = await fetch(
        `https://app.launchdarkly.com/api/v2/flags/${process.env.LD_PROJECT_TWO}/${featureFlagKey}?ignoreConflicts=true`,
        {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json; domain-model=launchdarkly.semanticpatch',
                Authorization: process.env.LAUNCH_DARKLY_PERSONAL_ACCESS_TOKEN,
                'cache-control': 'no-cache'
            },
            body: JSON.stringify(
                {"comment":"","instructions":[{"kind":"updateDefaultVariation", [variation]:value}]}
            )
        }
    );

    return NextResponse.json(resp)
}

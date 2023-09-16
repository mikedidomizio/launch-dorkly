import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { listProjects } from '@/app/api/listProjects'
import { ErrorAlert } from '@/components/ErrorAlert'

const readableErrorMessage = (error: string) => {
  switch (error) {
    case 'fetchProjects':
      return 'We could not fetch your LaunchDarkly projects. Is the access token correct?'
    default:
      return 'Unknown error'
  }
}

const oneHour = 60 * 60 * 1000

export default function Page({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  async function setCookie(formData: FormData) {
    'use server'
    const token = formData.get('accessToken')

    if (token && typeof token === 'string') {
      // the purpose of the following is that if we can't get the projects, the token is probably not good
      const projects = await listProjects(token)

      if (projects?.status === 200) {
        cookies().set({
          name: 'LD_TOKEN',
          value: token,
          // the token is set for one hour just because if someone were to use this
          expires: Date.now() + oneHour,
          path: '/',
        })

        redirect('/')
      }

      cookies().delete('LD_TOKEN')
      redirect('/start?error=fetchProjects')
    }
  }

  return (
    <div className="flex justify-content min-h-screen min-w-screen prose max-w-none items-center justify-center">
      <div className="text-center">
        <h1 className="heading-1">LaunchDorkly</h1>
        {searchParams.error ? (
          <ErrorAlert>{readableErrorMessage(searchParams.error)}</ErrorAlert>
        ) : (
          <h2>Let&apos;s Go!</h2>
        )}
        <p>
          <form action={setCookie}>
            <ol>
              <li>
                Create an access token in{' '}
                <Link
                  target="_blank"
                  href="https://app.launchdarkly.com/settings/authorization"
                >
                  LaunchDarkly
                </Link>
                , or use an existing one
              </li>
              <li>
                Put that access token in the input below!
                <br />
                <input
                  type="password"
                  placeholder="LaunchDarkly Access Token"
                  className="input input-bordered w-full max-w-xs"
                  name="accessToken"
                  autoComplete="off"
                />
                <br />
                (This is set as a cookie in your browser that expires after 1
                hour,
                <br /> it is not saved anywhere in the application.)
              </li>
              <li>
                Click the{' '}
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>{' '}
                button
              </li>
            </ol>
          </form>
        </p>
      </div>
    </div>
  )
}

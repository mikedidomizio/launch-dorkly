import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { listProjects } from '@/app/api/listProjects'
import { Error } from '@/components/Error'

const readableErrorMessage = (error: string) => {
  switch (error) {
    case 'fetchProjects':
      return 'We could not fetch your LaunchDarkly projects. Is the access token correct?'
    default:
      return 'Unknown error'
  }
}

export default function Page({
  searchParams,
}: {
  searchParams: { error: string }
}) {
  async function setCookie(formData: FormData) {
    'use server'
    const token = formData.get('accessToken')

    if (token) {
      cookies().set({
        name: 'LD_TOKEN',
        value: token as string,
        path: '/',
      })

      // the purpose of the following is that if we can't get the projects, the token is probably not good
      const projects = await listProjects()

      if (projects.status === 200) {
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
          <Error>{readableErrorMessage(searchParams.error)}</Error>
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
              </li>
              <li>
                Put that access token in the input below!
                <br />
                <input
                  type="password"
                  placeholder="LaunchDarkly Access Token"
                  className="input input-bordered w-full max-w-xs"
                  name="accessToken"
                  autocomplete="off"
                />
                <br />
                (This is set as a cookie in your browser,
                <br /> it is not saved anywhere in the application)
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

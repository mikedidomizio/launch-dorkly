import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { GitHubImage } from '@/components/GitHubLink'

export const Header = () => {
  async function removeCookie() {
    'use server'
    cookies().delete('LD_TOKEN')
    redirect('/start')
  }

  return (
    <header className="p-6 px-12 flex flex-row justify-between items-center">
      <div className="flex items-center space-x-4">
        <h1 className="heading-1 mb-0 ">
          <Link className="no-underline" href="/">
            LaunchDorkly
          </Link>
        </h1>
        <form action={removeCookie}>
          <button type="submit">Remove cookie (logout)</button>
        </form>
      </div>
      <Link
        target="_blank"
        href="https://github.com/mikedidomizio/launchdorkly"
      >
        <GitHubImage />
      </Link>
    </header>
  )
}

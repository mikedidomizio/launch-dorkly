import Link from "next/link";

export const Header = () => {
    return <header className="p-12">
        <h1 className="heading-1 mb-0 ">
            <Link className="no-underline" href="/">LaunchDorkly</Link>
        </h1>
    </header>
}

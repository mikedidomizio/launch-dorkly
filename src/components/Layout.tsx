import {Header} from "@/components/Header";
import {ReactNode} from "react";

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen min-w-screen prose max-w-none">
            <Header />
            <main className="px-12">{children}</main>
        </div>
    )
}

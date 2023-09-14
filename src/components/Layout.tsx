import {Header} from "@/components/Header";
import {ReactNode} from "react";

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen flex-col p-24">
            <Header />
            <main>{children}</main>
        </div>
    )
}

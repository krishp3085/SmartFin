import { HeaderLogo } from "@/components/header-logo";
import { Navigation } from "@/components/navigation";
import { UserButton, ClerkLoading,ClerkLoaded } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { WelcomeMsg } from "./welcome-msg";
import { Filters } from "./filters";

export const Header = () => {
    return ( 
        <header className="bg-gradient-to-b from-green-600 to-green-700 px-4 py-8 lg:px-14 pb-36">
            <div className="max-w-screen-2xl mx-auto">
                <div className="w-full flex items-center justify-center mb-14">
                    <div className="flex items-center lg:gap-x-16">
                        <HeaderLogo/>
                        <Navigation/>
                    </div>
                    <ClerkLoaded>
                        <UserButton afterSignOutUrl="/home"/>
                    </ClerkLoaded>
                    <ClerkLoading>
                        <Loader2 className="size-8 animate-spin text-slate-400"/>
                    </ClerkLoading>
                </div>
                <WelcomeMsg/>
                <Filters/>
            </div>
        </header>
     );
}
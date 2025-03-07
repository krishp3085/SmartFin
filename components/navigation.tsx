"use client";

import { usePathname, useRouter } from "next/navigation"; 
import { NavButton } from "@/components/nav-button";
import {Sheet, SheetContent, SheetTrigger,} from "./ui/sheet";
import {useMedia} from "react-use";
import { useState } from "react";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import Image from 'next/image';

const routes = [
    {
        href: "/",
        label: "Overview",
    },
    {
        href: "/transactions",
        label: "Transactions",
    },

    {
        href: "/accounts",
        label: "Accounts",
    },

    {
        href: "/categories",
        label: "Categories",
    },

    {
        href: "/settings",
        label: "Settings",
    },
];
export const Navigation = () => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const isMobile = useMedia("(max-width: 1024px)", false);
    const onClick = (href: string) =>{
        router.push(href);
        setIsOpen(false);
    };
    if(isMobile){
        return (
            <div className="relative mr-17 flex items-center justify-between px-4 py-2 bg-transparent">
                {/* Menu Icon */}
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger>
                        <Button
                            variant="outline"
                            size="sm"
                            className="mr-24 font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white focus:bg-white/30 transition"
                        >
                            <Menu className="size-4"/>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="px-2">
                        <nav className="flex flex-col gap-y-2 pt-6">
                            {routes.map((route) => (
                                <Button
                                    key={route.href}
                                    variant={route.href === pathname ? "secondary" : "ghost"}
                                    onClick={() => onClick(route.href)}
                                    className="w-full justify-start"
                                >
                                    {route.label}
                                </Button>
                            ))}
                        </nav>
                    </SheetContent>
                </Sheet>

                {/* Center Content */}
                <div className="mr-20 flex items-center ml-6">
                    <Image src = "/logo.svg" alt = "Logo" height={28} width={28}/>
                    <span className="text-lg font-medium text-white">SmartFin</span>
                </div>
            </div>
        )
    }
                return (
                <nav className="hidden lg:flex items-center gap-x-2 overflow-x-auto">
                    {routes.map((route) => (
                        <NavButton
                            key={route.href}
                            href={route.href}
                            label={route.label}
                            isActive={pathname === route.href}/>
                    ))}
                </nav>
                );
                }
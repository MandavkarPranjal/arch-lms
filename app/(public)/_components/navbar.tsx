"use client";

import Image from "next/image";
import Link from "next/link";
import VercelLogo from "@/public/vercel.svg";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { authClient } from "@/lib/auth-client";
import { Button, buttonVariants } from "@/components/ui/button";
import { UserDropdown } from "./userDropdown";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";

const navigationItems = [
    { name: "Home", href: "/" },
    { name: "Courses", href: "/courses" },
    { name: "Dashboard", href: "/dashboard" },
]

export function Navbar() {
    const { data: session, isPending } = authClient.useSession()
    return (
        <header
            // className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-[backdrop-filter]:bg-background/60"
            className="sticky top-0 z-50 w-full border-b px-4 md:px-6 bg-background/95 backdrop-blur-[backdrop-filter]:bg-background/60"
        >
            <div className="flex h-16 items-center justify-between gap-4">
                {/* Left side */}
                <div className="flex items-center gap-2">
                    {/* Mobile menu trigger */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                className="group size-8 md:hidden"
                                variant="ghost"
                                size="icon"
                            >
                                <svg
                                    className="pointer-events-none"
                                    width={16}
                                    height={16}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M4 12L20 12"
                                        className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                                    />
                                    <path
                                        d="M4 12H20"
                                        className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                                    />
                                    <path
                                        d="M4 12H20"
                                        className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                                    />
                                </svg>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-36 p-1 md:hidden">
                            <NavigationMenu className="max-w-none *:w-full">
                                <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                                    {navigationItems.map((item) => (
                                        <NavigationMenuItem key={item.name} className="w-full">
                                            <NavigationMenuLink
                                                href={item.href}
                                                className="py-1.5"
                                            >
                                                {item.name}
                                            </NavigationMenuLink>
                                        </NavigationMenuItem>
                                    ))}
                                </NavigationMenuList>
                            </NavigationMenu>
                        </PopoverContent>
                    </Popover>
                    {/* Main nav */}
                    <div className="flex items-center gap-6">
                        <Link href="/" className="flex items-center space-x-2 mr-4">
                            <Image src={VercelLogo} alt="Logo" className="size-9" />
                            <span className="font-bold">Arch LMS</span>
                        </Link>
                        {/* Navigation menu */}
                        <NavigationMenu className="max-md:hidden">
                            <NavigationMenuList className="gap-2">
                                {navigationItems.map((item) => (
                                    <NavigationMenuItem key={item.name}>
                                        <NavigationMenuLink
                                            href={item.href}
                                            className="text-muted-foreground hover:text-primary py-1.5 font-medium"
                                        >
                                            {item.name}
                                        </NavigationMenuLink>
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>
                </div>
                {/* Desktop navigation */}
                {/**
                   <nav className="hidden md:flex md:flex-1 md:items-center md:justify-between">
                   <div className="flex items-center space-x-2">
                   {navigationItems.map((item) => (
                   <Link key={item.name} href={item.href} className="text-sm font-medium transition-colors hover:text-primary">
                   {item.name}
                   </Link>
                   ))}
                   </div>

                 <div className="flex items-center space-x-4">
                 */}
                <div className="flex items-center space-x-4">

                    <ThemeToggle />

                    {isPending ? null : session ? (
                        <UserDropdown
                            email={session.user.email}
                            image={session?.user.image ?? `https://avatar.vercel.sh/${session?.user.email}`}
                            name={
                                session?.user.name && session.user.name.length > 0
                                    ? session.user.name
                                    : session?.user.email.split("@")[0]
                            }
                        />
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className={buttonVariants({ variant: "secondary" })}
                            >
                                Login
                            </Link>
                            <Link
                                href="/login"
                                className={buttonVariants()}
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header >
    )
}

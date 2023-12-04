import React, { useState } from 'react'
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signIn, signOut, useSession } from "next-auth/react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils";
import Link from 'next/link';

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"

type LinkTab = {
  href: string,
  title: string,
  desc: string  
};

const dropdownItems: LinkTab[] = [
    {
        href: "/explore",
        title: "Explore",
        desc: "Explore some of the articles written by our users."
    },
    {
        href: "/dashboard",
        title: "Dashboard",
        desc: "See and update all of your financial details."
    },
    {
        href: "/settings",
        title: "Settings",
        desc: "Change and modify your account settings."
    },
    {
        href: "/api/auth/signout",
        title: "Sign out",
        desc: "Securely sign out of your account."
    }
];

const AccountDropDown = ({ items }: { items: LinkTab[] }) => {
    const [ toggle, setToggle ] = useState(false);
    const { data: session } = useSession();
    if (!session) return null;
    return (
        <div className="relative">

        <button onClick={() => setToggle(!toggle)}>
            <Avatar>
                <AvatarImage src={session?.user?.image ?? "https://placeholder.co/500/500"} alt={`${session?.user?.name ?? "Account"} profile avatar.`} />
                <AvatarFallback>{session?.user?.name ?? "Account"}</AvatarFallback>
            </Avatar>
        </button>

        { toggle && (
            <div className="absolute top-16 right-0 bg-stone-50/50 shadow-sm shadow-black/20 rounded-md p-4">
                <ul className="animate-fade-in  grid grid-cols-2 space-x-1 w-max">    
                    { items.map((item, idx) => {
                        return <li key={`accountdropdownitem${idx}`} className="w-40 hover:bg-stone-100/80 rounded-md p-3">
                            <Link href={item.href}>
                                <h6 className="font-bold text-base">{item.title}</h6>
                                <p className="text-sm mt-2">{item.desc}</p>
                            </Link>
                        </li>
                    }) }
                </ul>
            </div>
        )}

        </div>
    )
}



const Nav = () => {
  const { data: session } = useSession();
  return (
    <nav className='h-14 w-full bg-stone-100/10 default-p-x flex justify-between items-center border-b-[1px] border-b-stone-100'>
        
        <div>
            <Link href="/">
                <h4 className="font-bold">Title</h4>
            </Link>
        </div>
        <div>
            {
                session ? 
                    <AccountDropDown items={dropdownItems} /> :
                    <Button variant="outline" onClick={() => signIn() }>Sign In</Button>
            }
        </div>
    </nav>
  )
}

export default Nav
"use client"

import * as React from "react"
import Link from "next/link"

import { cn } from "../lib/utils"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu"
import { MeDocument, MeQuery, useLogoutMutation, useMeQuery } from "@/gql/grapqhql"
import { useRouter } from 'next/navigation'


import {
  LogOut,
  User,
  ChevronDown
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Router from "next/router"



export default function NavigationMenuDemo() {
  const router = useRouter()

  const [{fetching, data}] = useMeQuery();

  const [, logoutFunction] = useLogoutMutation()
  const meQuery = MeDocument

  const handleLogout = async () => {
    try {
      const response = await logoutFunction({

      })

      if(response.data?.logout === true) {
        router.push('/login', {scroll: false})
      }
    } catch (err) {
      console.error(err)
    }
  }

  const modifyNavbar = ( data:MeQuery | undefined, fetching:boolean ) => {
    if(fetching) {
      return null
    } else if (!data?.user) {
      return (
          <div className="flex gap-2">
            <NavigationMenuItem>
              <Link href="/register" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Register
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/login" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Login
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </div>
      )
    } else {
      return (
        <div className="flex gap-2">
            <NavigationMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger >
                  <Button variant="ghost">
                    {data.user.username}
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-fit" align="end" forceMount>
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="hover:cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  {/* <DropdownMenuItem>
                    <Github className="mr-2 h-4 w-4" />
                    <span>GitHub</span>
                  </DropdownMenuItem> */}
                  {/* <DropdownMenuSeparator /> */}
                  <DropdownMenuItem onClick={handleLogout} className="hover:cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </NavigationMenuItem>
          </div>
      )
    }
  }

  return (
    <NavigationMenu className="max-w-none justify-start w-full mx-auto bg-slate-900 rounded-md">
      <div className="w-full">

      <NavigationMenuList className="p-4 justify-between">
          <div className="flex p-2">
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink>
                  Reddited
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </div>
          { modifyNavbar(data, fetching) }
        </NavigationMenuList>
      </div>
    </NavigationMenu>
  )
}

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
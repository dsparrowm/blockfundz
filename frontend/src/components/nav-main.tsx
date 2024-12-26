"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import {useStore} from "../store/useStore"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { data } from "../constants"

type NavItem = {
  title: string
  url: string
  onclick: () => void
  icon?: LucideIcon
  isActive?: boolean
  items?: {
    title: string
    url: string
  }[]
}

interface NavMainProps {
  userItems: NavItem[]
  adminItems: NavItem[]
  isAdmin: boolean
}

export function NavMain({isAdmin}: NavMainProps) {
  const setComponent = !isAdmin ? useStore((state) => state.setActiveComponent) : useStore((state) => state.setActiveAdminComponent)
  const activeUserComponent = useStore((state) => state.activeComponent)
  const activeAdminComponent = useStore((state) => state.activeAdminComponent)
  console.log(`adminComponent: ${activeAdminComponent}`)
  console.log(`userComponent: ${activeUserComponent}`)

  const items = isAdmin ? data.adminNavMain : data.userNavMain
  
  return (
    <SidebarGroup>
      {/* <SidebarGroupLabel>Platform</SidebarGroupLabel> */}
      <SidebarMenu>
        {items.map((item) => (
          item.title === "Send Mail" ? (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <SidebarMenuButton tooltip={item.title} onClick={() => setComponent(item.title)}>
                  {item.icon && <item.icon color="gray"/>}
                  <span className="text-gray-600 font-montserrat font-bold">{item.title}</span>
                  <ChevronRight color="gray" className="ml-auto transition-transform duration-200" />
                </SidebarMenuButton>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem key="Send to a User">
                      <SidebarMenuSubButton asChild>
                        <a href="/send-to-user">
                          <span>Send to a User</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem key="Send to All Users">
                      <SidebarMenuSubButton asChild>
                        <a href="/send-to-all-users">
                          <span>Send to All Users</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <SidebarMenuButton tooltip={item.title} onClick={() => setComponent(item.title)}>
                  {item.icon && <item.icon color="gray"/>}
                  <span className="text-gray-600 font-montserrat font-bold">{item.title}</span>
                  <ChevronRight color="gray" className="ml-auto transition-transform duration-200" />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </Collapsible>
          )
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
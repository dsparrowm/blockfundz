"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import { useStore } from "../store/useStore"
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

export function NavMain({ isAdmin }: NavMainProps) {
  const setComponent = !isAdmin ? useStore((state) => state.setActiveComponent) : useStore((state) => state.setActiveAdminComponent)

  const items = isAdmin ? data.adminNavMain : data.userNavMain
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  })

  return (
    <div className="flex flex-col gap-4">
      {/* New Account Balance Section */}
      {!isAdmin && (
        <div className="px-4 py-6 border-b hidden md:block">
          <h1 className="text-sm font-bold text-slate-600 mb-2">MAIN BALANCE</h1>
          <h2 className="text-2xl font-bold text-red-500 mb-1">$0.00</h2>
          <p className="text-sm text-gray-500 mb-4">{currentDate}</p>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 text-sm">Investment Profit</span>
              <span className="font-semibold text-gray-800">$0.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Active Investment</span>
              <span className="font-semibold text-gray-800">$0.00</span>
            </div>
          </div>

          <div className="flex flex-row gap-2">
            <button onClick={() => setComponent('Deposits')} className="w-full py-2 bg-green-500 text-white rounded-md text-sm font-semibold hover:bg-green-600">
              DEPOSIT
            </button>
            <button onClick={() => setComponent('Withdrawals')} className="w-full py-2 bg-orange-500 text-white rounded-md text-sm font-semibold hover:bg-red-600">
              WITHDRAW
            </button>
          </div>
        </div>
      )}

      {/* Existing Menu Section */}
      <SidebarGroup>
        <SidebarGroupLabel className="text-md">Menu</SidebarGroupLabel>
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
                    {item.icon && <item.icon color="gray" />}
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
                    {item.icon && <item.icon color="gray" />}
                    <span className="text-coral-black font-Roboto md:text-[18px]">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </Collapsible>
            )
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </div>
  )
}
import React from "react";
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import DashboardCard from "@/components/DashboardCard"

import { Separator } from "@/components/ui/separator"

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import renderUserDashboardComponent from "../../helpers/renderUserDashboardComponent"
import renderAdminDashboardComponent from "../../helpers/renderAdminDashboardComponent";
import { useStore } from "../../store/useStore"
import { useLocation } from "react-router-dom";
import { extractBalances } from "../../helpers/extractCoinBalances";



export default function Page() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  const activeComponent = !isAdmin ? useStore((state) => state.activeComponent) : useStore((state) => state.activeAdminComponent)
  const userData = useStore(state => state.user)
  const data = userData?.balances ? extractBalances(userData.balances) : {}
  const coin = Object.entries(data)
  const coins = coin.map(([key, value]) => ({ name: key, balance: value }))

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    <span className="text-sm">{activeComponent}</span>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 ">
          {!isAdmin ?
            <div>
              {/* <div className="grid auto-rows-min gap-4 md:grid-cols-4 mb-6">
                {coins.map((coin) => (
                <DashboardCard key={coin.name} coin={coin} />
              ))}
              </div> */}

              {renderUserDashboardComponent()}

            </div> : renderAdminDashboardComponent()}
        </div>

      </SidebarInset>
    </SidebarProvider>
  )
}

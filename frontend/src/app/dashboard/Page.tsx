import { useEffect, useState } from "react";
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
import UserMenu from "@/components/UserMenu";
import CryptoTicker from "@/components/CryptoTicker";



export default function Page() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  const activeComponent = !isAdmin ? useStore((state) => state.activeComponent) : useStore((state) => state.activeAdminComponent)
  const userData = useStore(state => state.user)
  const data = userData?.balances ? extractBalances(userData.balances) : {}
  const coin = Object.entries(data)
  const coins = coin.map(([key, value]) => ({ name: key, balance: value }))
  const [cryptoData, setCryptoData] = useState([
    { symbol: 'BTC', price: 64823.45, change: 2.45 },
    { symbol: 'ETH', price: 3321.67, change: -1.23 },
    { symbol: 'SOL', price: 154.89, change: 5.78 },


  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCryptoData(prev => prev.map(coin => ({
        ...coin,
        price: coin.price * (1 + (Math.random() * 0.02 - 0.01)),
        change: coin.change + (Math.random() * 0.4 - 0.2)
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center relative overflow-hidden bg-white whitespace-nowrap gap-2 pr-12 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    <span className="text-lg text-slate-800">{activeComponent}</span>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <CryptoTicker />
          <UserMenu />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-4 bg-slate-100 z-0">
          {!isAdmin ?
            <div>

              {renderUserDashboardComponent()}

            </div> : renderAdminDashboardComponent()}
        </div>

      </SidebarInset>
    </SidebarProvider>
  )
}

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"
import { useLocation } from "react-router-dom"

import { NavMain } from "@/components/nav-main"
// import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useStore } from "../store/useStore"


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')
  const userData = useStore((state) => state.user)
  const firstName = isAdmin ? "admin" : userData?.name.split(" ")[0]

  const data = {
    user: {
      name: firstName,
      email: userData?.email,
      avatar: "/avatars/shadcn.jpg",
    },
    teams: [
      {
        name: "Acme Inc",
        logo: GalleryVerticalEnd,
        plan: "Enterprise",
      },
      {
        name: "Acme Corp.",
        logo: AudioWaveform,
        plan: "Startup",
      },
      {
        name: "Evil Corp.",
        logo: Command,
        plan: "Free",
      },
    ],
    userNavMain: [
      {
        title: "Overview",
        url: "#",
        icon: SquareTerminal,
        isActive: true,
      },
      {
        title: "Invest",
        url: "#",
        icon: Bot,
      },
      {
        title: "Investments",
        url: "#",
        icon: BookOpen,
      },
      {
        title: "Deposits",
        url: "#",
        icon: BookOpen,
      },
      {
        title: "Deposit History",
        url: "#",
        icon: Settings2,
      },
      {
        title: "Withdrawal",
        url: "#",
        icon: SquareTerminal,
        isActive: true,
      },
      {
        title: "Withdrawal History",
        url: "#",
        icon: SquareTerminal,
        isActive: true,
      },
    ],
    adminNavMain: [
      {
        title: "Dashboard",
        url: "#",
        icon: PieChart,
        isActive: true,
      },
      {
        title: "Settings",
        url: "#",
        icon: Settings2,
      },
      {
        title: "Map",
        url: "#",
        icon: Map,
      },
      {
        title: "Frame",
        url: "#",
        icon: Frame,
      },
    ],
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain isAdmin={isAdmin} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

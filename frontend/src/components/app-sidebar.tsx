import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  LogOut,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"

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
import Button from "./myButton"
import { FaSignOutAlt } from "react-icons/fa"


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation()
  const navigate = useNavigate();
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

  const handleLogout = () => {
    // Clear user data from local storage or state management
    localStorage.removeItem('token');
    localStorage.setItem('isLoggedIn', 'no');
    // Redirect to Home page
    navigate('/');
  };

  return (
    <Sidebar collapsible="icon" {...props} className="overflow-x-hidden">
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain isAdmin={isAdmin} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200"
          type="button"
          aria-label="Logout"
        >
          <FaSignOutAlt className="w-5 h-5" />
          <span>Logout</span>
        </button>
        {/* <NavUser user={data.user} /> */}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

"use client"

import { useSelector, useDispatch } from "react-redux"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { toggleSidebar } from "@/lib/store/slices/uiSlice"
import type { RootState } from "@/lib/store"
import { QrCode, BarChart3, Users, Settings, CreditCard, Menu, Home, Plus } from "lucide-react"

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
    roles: ["USER", "ADMIN"],
  },
  {
    title: "Create QR",
    href: "/dashboard/create",
    icon: Plus,
    roles: ["USER", "ADMIN"],
  },
  {
    title: "My QR Codes",
    href: "/dashboard/qr-codes",
    icon: QrCode,
    roles: ["USER", "ADMIN"],
    premium: true,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
    roles: ["USER", "ADMIN"],
    premium: true,
  },
  {
    title: "Users",
    href: "/dashboard/users",
    icon: Users,
    roles: ["ADMIN"],
  },
  {
    title: "Billing",
    href: "/dashboard/billing",
    icon: CreditCard,
    roles: ["USER", "ADMIN"],
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    roles: ["USER", "ADMIN"],
  },
]

export function Sidebar() {
  const { data: session } = useSession()
  const dispatch = useDispatch()
  const pathname = usePathname()
  const { sidebarCollapsed } = useSelector((state: RootState) => state.ui)

  const userRole = session?.user?.role || "USER"
  const userPlan = session?.user?.plan || "FREE"

  const filteredMenuItems = menuItems.filter((item) => {
    if (!item.roles.includes(userRole)) return false
    if (item.premium && userPlan === "FREE") return false
    return true
  })

  return (
    <motion.aside
      initial={false}
      animate={{
        width: sidebarCollapsed ? 80 : 280,
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="hidden md:flex flex-col bg-white border-r border-gray-200 h-screen sticky top-0"
    >
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <QrCode className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl">QR Pro</span>
            </motion.div>
          )}
          <Button variant="ghost" size="sm" onClick={() => dispatch(toggleSidebar())} className="p-2">
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn("w-full justify-start gap-3", sidebarCollapsed && "px-3")}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="truncate"
                  >
                    {item.title}
                  </motion.span>
                )}
              </Button>
            </Link>
          )
        })}
      </nav>

      {!sidebarCollapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="p-4 border-t border-gray-200"
        >
          <div className="text-sm text-gray-600">
            <p className="font-medium">{session?.user?.name}</p>
            <p className="text-xs">{session?.user?.email}</p>
            <div className="mt-2">
              <span
                className={cn(
                  "inline-block px-2 py-1 rounded-full text-xs font-medium",
                  userPlan === "PREMIUM" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800",
                )}
              >
                {userPlan}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.aside>
  )
}

"use client"

import { useSelector, useDispatch } from "react-redux"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { setMobileMenuOpen } from "@/lib/store/slices/uiSlice"
import type { RootState } from "@/lib/store"
import { QrCode, BarChart3, Users, Settings, CreditCard, X, Home, Plus } from "lucide-react"

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

export function MobileSidebar() {
  const { data: session } = useSession()
  const dispatch = useDispatch()
  const pathname = usePathname()
  const { mobileMenuOpen } = useSelector((state: RootState) => state.ui)

  const userRole = session?.user?.role || "USER"
  const userPlan = session?.user?.plan || "FREE"

  const filteredMenuItems = menuItems.filter((item) => {
    if (!item.roles.includes(userRole)) return false
    if (item.premium && userPlan === "FREE") return false
    return true
  })

  const closeMobileMenu = () => {
    dispatch(setMobileMenuOpen(false))
  }

  return (
    <AnimatePresence>
      {mobileMenuOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={closeMobileMenu}
          />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed left-0 top-0 h-full w-80 bg-white border-r border-gray-200 z-50 md:hidden"
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <QrCode className="h-8 w-8 text-primary" />
                  <span className="font-bold text-xl">QR Pro</span>
                </div>
                <Button variant="ghost" size="sm" onClick={closeMobileMenu}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <nav className="flex-1 p-4 space-y-2">
              {filteredMenuItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <Link key={item.href} href={item.href} onClick={closeMobileMenu}>
                    <Button variant={isActive ? "default" : "ghost"} className="w-full justify-start gap-3">
                      <Icon className="h-5 w-5" />
                      {item.title}
                    </Button>
                  </Link>
                )
              })}
            </nav>

            <div className="p-4 border-t border-gray-200">
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
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"

const navItems = [
  { label: "হোম", href: "/dashboard", icon: "🏠" },
  { label: "কিস্তি", href: "/my-loans", icon: "💰" },
  { label: "সাহায্য", href: "/help", icon: "❓" },
  { label: "প্রোফাইল", href: "/profile", icon: "👤" },
]

export function BottomNavigation() {
  const pathname = usePathname()
  const isMobile = useIsMobile()

  if (!isMobile) {
    return (
      <nav className="desktop-nav">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold">L</span>
          </div>
          <h1 className="text-xl font-bold text-foreground">আইসিসি ঋণ সেবা</h1>
        </div>
        <div className="desktop-nav-links">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "desktop-nav-link flex items-center gap-2",
                pathname.startsWith(item.href) ? "active" : ""
              )}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-sm text-foreground hover:text-primary transition-colors">
            লগআউট
          </button>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bottom-nav flex items-center justify-around">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex-1 py-4 flex flex-col items-center justify-center text-xs gap-1 transition-colors",
            pathname.startsWith(item.href)
              ? "text-primary font-semibold"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <span className="text-lg">{item.icon}</span>
          <span className="text-center">{item.label}</span>
        </Link>
      ))}
    </nav>
  )
}
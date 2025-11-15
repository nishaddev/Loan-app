"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { Home, Wallet, HelpCircle, User } from 'lucide-react'

const navItems = [
  { label: "হোম", href: "/dashboard", icon: Home },
  { label: "কিস্তি", href: "/my-loans", icon: Wallet },
  { label: "সাহায্য", href: "/help", icon: HelpCircle },
  { label: "প্রোফাইল", href: "/profile", icon: User },
]

export function BottomNavigation() {
  const pathname = usePathname()
  const isMobile = useIsMobile()

  if (!isMobile) {
    return (
      <nav className="desktop-nav">
        <div className="flex items-center">
          <Link href="/dashboard" className="flex items-center">
            <img 
              src="/The_World_Bank_logo.png" 
              alt="বিশ্ব ব্যাংক বাংলাদেশের ঋণ সেবা" 
              className="h-10 w-auto"
            />
          </Link>
        </div>
        <div className="desktop-nav-links mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "desktop-nav-link flex items-center gap-2",
                  pathname.startsWith(item.href) ? "active" : ""
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
        <div className="flex items-center space-x-4">
          <button 
            className="text-sm font-bold text-red-600 hover:text-red-700 transition-colors"
            onClick={() => {
              localStorage.removeItem("userId");
              window.location.href = "/login";
            }}
          >
            লগ আউট
          </button>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bottom-nav flex items-center justify-around">
      {navItems.map((item) => {
        const Icon = item.icon
        return (
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
            <Icon className="w-5 h-5" />
            <span className="text-center">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
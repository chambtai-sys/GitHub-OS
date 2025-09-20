"use client"

import { Button } from "@/components/ui/button"
import { GitBranchIcon, SearchIcon, BellIcon, UserIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface TaskbarProps {
  openWindows: string[]
  activeWindow: string | null
  onFocusWindow: (windowId: string) => void
  onOpenWindow: (windowId: string) => void
}

const windowTitles: Record<string, string> = {
  "file-manager": "Files",
  terminal: "Terminal",
  "code-editor": "Code",
  "git-manager": "Git",
  database: "Database",
  browser: "Browser",
  notes: "Notes",
  settings: "Settings",
}

export function Taskbar({ openWindows, activeWindow, onFocusWindow, onOpenWindow }: TaskbarProps) {
  return (
    <div className="h-12 bg-card border-t border-border flex items-center justify-between px-4">
      {/* Left side - Start menu and open windows */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onOpenWindow("start-menu")}>
          <GitBranchIcon className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1">
          {openWindows.map((windowId) => (
            <Button
              key={windowId}
              variant={activeWindow === windowId ? "secondary" : "ghost"}
              size="sm"
              className="h-8 px-3 text-xs"
              onClick={() => onFocusWindow(windowId)}
            >
              {windowTitles[windowId] || windowId}
            </Button>
          ))}
        </div>
      </div>

      {/* Center - Search */}
      <div className="flex-1 max-w-md mx-4">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search repositories, files, and more..."
            className="w-full h-8 pl-10 pr-4 bg-input border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Right side - System tray */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 relative">
          <BellIcon className="h-4 w-4" />
          <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs bg-destructive">3</Badge>
        </Button>

        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <UserIcon className="h-4 w-4" />
        </Button>

        <div className="text-xs text-muted-foreground ml-2">
          {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    </div>
  )
}

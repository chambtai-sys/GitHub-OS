"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MinusIcon, SquareIcon, XIcon } from "lucide-react"
import { FileManager } from "./apps/file-manager"
import { Terminal } from "./apps/terminal"
import { CodeEditor } from "./apps/code-editor"
import { GitManager } from "./apps/git-manager"
import { Browser } from "./apps/browser"
import { Database } from "./apps/database"
import { Notes } from "./apps/notes"
import { Settings } from "./apps/settings"

interface WindowManagerProps {
  openWindows: string[]
  activeWindow: string | null
  onCloseWindow: (windowId: string) => void
  onFocusWindow: (windowId: string) => void
}

interface WindowState {
  id: string
  x: number
  y: number
  width: number
  height: number
  isMaximized: boolean
  isMinimized: boolean
}

const defaultWindowStates: Record<string, Omit<WindowState, "id">> = {
  "file-manager": { x: 100, y: 100, width: 800, height: 600, isMaximized: false, isMinimized: false },
  terminal: { x: 150, y: 150, width: 700, height: 400, isMaximized: false, isMinimized: false },
  "code-editor": { x: 200, y: 200, width: 900, height: 700, isMaximized: false, isMinimized: false },
  "git-manager": { x: 250, y: 250, width: 600, height: 500, isMaximized: false, isMinimized: false },
  browser: { x: 120, y: 120, width: 1000, height: 700, isMaximized: false, isMinimized: false },
  database: { x: 180, y: 180, width: 900, height: 600, isMaximized: false, isMinimized: false },
  notes: { x: 220, y: 220, width: 800, height: 600, isMaximized: false, isMinimized: false },
  settings: { x: 300, y: 300, width: 700, height: 500, isMaximized: false, isMinimized: false },
}

const windowTitles: Record<string, string> = {
  "file-manager": "File Manager",
  terminal: "Terminal",
  "code-editor": "Code Editor",
  "git-manager": "Git Manager",
  browser: "Browser",
  database: "Database",
  notes: "Notes",
  settings: "Settings",
}

export function WindowManager({ openWindows, activeWindow, onCloseWindow, onFocusWindow }: WindowManagerProps) {
  const [windowStates, setWindowStates] = useState<Record<string, WindowState>>({})

  const getWindowState = (windowId: string): WindowState => {
    return (
      windowStates[windowId] || {
        id: windowId,
        ...defaultWindowStates[windowId],
      }
    )
  }

  const updateWindowState = (windowId: string, updates: Partial<WindowState>) => {
    setWindowStates((prev) => ({
      ...prev,
      [windowId]: { ...getWindowState(windowId), ...updates },
    }))
  }

  const renderWindowContent = (windowId: string) => {
    switch (windowId) {
      case "file-manager":
        return <FileManager />
      case "terminal":
        return <Terminal />
      case "code-editor":
        return <CodeEditor />
      case "git-manager":
        return <GitManager />
      case "browser":
        return <Browser />
      case "database":
        return <Database />
      case "notes":
        return <Notes />
      case "settings":
        return <Settings />
      default:
        return (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            {windowTitles[windowId] || windowId} - Coming Soon
          </div>
        )
    }
  }

  return (
    <div className="absolute inset-0 pointer-events-none">
      {openWindows.map((windowId) => {
        const windowState = getWindowState(windowId)
        const isActive = activeWindow === windowId

        if (windowState.isMinimized) return null

        return (
          <div
            key={windowId}
            className={`absolute os-window pointer-events-auto ${
              isActive ? "z-50" : "z-40"
            } ${isActive ? "ring-2 ring-accent" : ""}`}
            style={{
              left: windowState.isMaximized ? 0 : windowState.x,
              top: windowState.isMaximized ? 0 : windowState.y,
              width: windowState.isMaximized ? "100%" : windowState.width,
              height: windowState.isMaximized ? "calc(100% - 48px)" : windowState.height,
            }}
            onClick={() => onFocusWindow(windowId)}
          >
            {/* Window Title Bar */}
            <div className="os-titlebar cursor-move">
              <div className="flex items-center gap-2">
                <div className="text-sm font-medium">{windowTitles[windowId] || windowId}</div>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-muted"
                  onClick={(e) => {
                    e.stopPropagation()
                    updateWindowState(windowId, { isMinimized: true })
                  }}
                >
                  <MinusIcon className="h-3 w-3" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-muted"
                  onClick={(e) => {
                    e.stopPropagation()
                    updateWindowState(windowId, { isMaximized: !windowState.isMaximized })
                  }}
                >
                  <SquareIcon className="h-3 w-3" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                  onClick={(e) => {
                    e.stopPropagation()
                    onCloseWindow(windowId)
                  }}
                >
                  <XIcon className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Window Content */}
            <div className="os-content flex-1 overflow-hidden">{renderWindowContent(windowId)}</div>
          </div>
        )
      })}
    </div>
  )
}

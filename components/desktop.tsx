"use client"

import { useState } from "react"
import { Taskbar } from "./taskbar"
import { DesktopIcons } from "./desktop-icons"
import { WindowManager } from "./window-manager"
import { StartMenu } from "./start-menu"

export function Desktop() {
  const [openWindows, setOpenWindows] = useState<string[]>([])
  const [activeWindow, setActiveWindow] = useState<string | null>(null)
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false)

  const openWindow = (windowId: string) => {
    if (windowId === "start-menu") {
      setIsStartMenuOpen(!isStartMenuOpen)
      return
    }

    if (!openWindows.includes(windowId)) {
      setOpenWindows([...openWindows, windowId])
    }
    setActiveWindow(windowId)
    setIsStartMenuOpen(false)
  }

  const closeWindow = (windowId: string) => {
    setOpenWindows(openWindows.filter((id) => id !== windowId))
    if (activeWindow === windowId) {
      const remainingWindows = openWindows.filter((id) => id !== windowId)
      setActiveWindow(remainingWindows.length > 0 ? remainingWindows[remainingWindows.length - 1] : null)
    }
  }

  const focusWindow = (windowId: string) => {
    setActiveWindow(windowId)
  }

  return (
    <div className="h-screen w-screen bg-background flex flex-col overflow-hidden">
      {/* Desktop Background */}
      <div
        className="flex-1 relative"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(31, 111, 235, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(35, 134, 54, 0.1) 0%, transparent 50%)`,
        }}
        onClick={() => setIsStartMenuOpen(false)}
      >
        <DesktopIcons onOpenWindow={openWindow} />
        <WindowManager
          openWindows={openWindows}
          activeWindow={activeWindow}
          onCloseWindow={closeWindow}
          onFocusWindow={focusWindow}
        />

        {isStartMenuOpen && <StartMenu onOpenWindow={openWindow} onClose={() => setIsStartMenuOpen(false)} />}
      </div>

      {/* Taskbar */}
      <Taskbar
        openWindows={openWindows}
        activeWindow={activeWindow}
        onFocusWindow={focusWindow}
        onOpenWindow={openWindow}
      />
    </div>
  )
}

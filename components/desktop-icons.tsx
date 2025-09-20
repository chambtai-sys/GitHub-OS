"use client"

import { Button } from "@/components/ui/button"
import {
  FolderIcon,
  TerminalIcon,
  FileTextIcon,
  GitBranchIcon,
  SettingsIcon,
  CodeIcon,
  DatabaseIcon,
  GlobeIcon,
} from "lucide-react"

interface DesktopIconsProps {
  onOpenWindow: (windowId: string) => void
}

const desktopApps = [
  { id: "file-manager", name: "Files", icon: FolderIcon },
  { id: "terminal", name: "Terminal", icon: TerminalIcon },
  { id: "code-editor", name: "Code", icon: CodeIcon },
  { id: "git-manager", name: "Git", icon: GitBranchIcon },
  { id: "database", name: "Database", icon: DatabaseIcon },
  { id: "browser", name: "Browser", icon: GlobeIcon },
  { id: "notes", name: "Notes", icon: FileTextIcon },
  { id: "settings", name: "Settings", icon: SettingsIcon },
]

export function DesktopIcons({ onOpenWindow }: DesktopIconsProps) {
  return (
    <div className="absolute inset-0 p-6">
      <div className="grid grid-cols-8 gap-6 h-full content-start">
        {desktopApps.map((app) => (
          <Button
            key={app.id}
            variant="ghost"
            className="h-20 w-20 flex flex-col items-center justify-center gap-2 hover:bg-muted/50 rounded-lg group"
            onClick={() => onOpenWindow(app.id)}
          >
            <app.icon className="h-8 w-8 text-foreground group-hover:text-accent transition-colors" />
            <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
              {app.name}
            </span>
          </Button>
        ))}
      </div>
    </div>
  )
}

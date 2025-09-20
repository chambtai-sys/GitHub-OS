"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  FolderIcon,
  TerminalIcon,
  FileTextIcon,
  GitBranchIcon,
  SettingsIcon,
  CodeIcon,
  DatabaseIcon,
  GlobeIcon,
  SearchIcon,
  PowerIcon,
  UserIcon,
  ClockIcon,
  StarIcon,
  HistoryIcon,
} from "lucide-react"

interface StartMenuProps {
  onOpenWindow: (windowId: string) => void
  onClose: () => void
}

const allApps = [
  { id: "file-manager", name: "File Manager", icon: FolderIcon, category: "System" },
  { id: "terminal", name: "Terminal", icon: TerminalIcon, category: "Development" },
  { id: "code-editor", name: "Code Editor", icon: CodeIcon, category: "Development" },
  { id: "git-manager", name: "Git Manager", icon: GitBranchIcon, category: "Development" },
  { id: "database", name: "Database", icon: DatabaseIcon, category: "Development" },
  { id: "browser", name: "Browser", icon: GlobeIcon, category: "Internet" },
  { id: "notes", name: "Notes", icon: FileTextIcon, category: "Productivity" },
  { id: "settings", name: "Settings", icon: SettingsIcon, category: "System" },
]

const recentFiles = [
  { name: "README.md", path: "/home/user/projects/github-os/README.md", time: "2 hours ago" },
  { name: "package.json", path: "/home/user/projects/github-os/package.json", time: "3 hours ago" },
  { name: "main.tsx", path: "/home/user/projects/app/main.tsx", time: "1 day ago" },
]

const pinnedApps = ["file-manager", "terminal", "code-editor", "git-manager"]

export function StartMenu({ onOpenWindow, onClose }: StartMenuProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")

  const categories = ["All", "Development", "System", "Internet", "Productivity"]

  const filteredApps = allApps.filter((app) => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === "All" || app.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const handleAppClick = (appId: string) => {
    onOpenWindow(appId)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] pointer-events-auto">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />

      {/* Start Menu Panel */}
      <div className="absolute bottom-12 left-4 w-96 h-[600px] bg-card border border-border rounded-lg shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
              <UserIcon className="w-4 h-4 text-accent-foreground" />
            </div>
            <div>
              <div className="text-sm font-medium">GitHub User</div>
              <div className="text-xs text-muted-foreground">github-os@localhost</div>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search apps and files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-9"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {/* Category Tabs */}
          <div className="px-4 py-2 border-b border-border">
            <div className="flex gap-1 overflow-x-auto">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "secondary" : "ghost"}
                  size="sm"
                  className="text-xs whitespace-nowrap"
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Pinned Apps */}
            {activeCategory === "All" && !searchQuery && (
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <StarIcon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Pinned</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {allApps
                    .filter((app) => pinnedApps.includes(app.id))
                    .map((app) => (
                      <Button
                        key={app.id}
                        variant="ghost"
                        className="h-16 flex flex-col items-center justify-center gap-1 hover:bg-muted/50"
                        onClick={() => handleAppClick(app.id)}
                      >
                        <app.icon className="w-6 h-6" />
                        <span className="text-xs">{app.name}</span>
                      </Button>
                    ))}
                </div>
                <Separator className="my-4" />
              </div>
            )}

            {/* All Apps */}
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <FolderIcon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">
                  {searchQuery ? "Search Results" : "All Apps"}
                </span>
                <Badge variant="secondary" className="text-xs">
                  {filteredApps.length}
                </Badge>
              </div>
              <div className="space-y-1">
                {filteredApps.map((app) => (
                  <Button
                    key={app.id}
                    variant="ghost"
                    className="w-full justify-start h-10 px-3"
                    onClick={() => handleAppClick(app.id)}
                  >
                    <app.icon className="w-4 h-4 mr-3" />
                    <div className="flex-1 text-left">
                      <div className="text-sm">{app.name}</div>
                      <div className="text-xs text-muted-foreground">{app.category}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Recent Files */}
            {activeCategory === "All" && !searchQuery && (
              <>
                <Separator />
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <HistoryIcon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">Recent Files</span>
                  </div>
                  <div className="space-y-1">
                    {recentFiles.map((file, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className="w-full justify-start h-10 px-3"
                        onClick={() => handleAppClick("code-editor")}
                      >
                        <FileTextIcon className="w-4 h-4 mr-3" />
                        <div className="flex-1 text-left">
                          <div className="text-sm">{file.name}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <ClockIcon className="w-3 h-3" />
                            {file.time}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" className="text-xs">
              <SettingsIcon className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button variant="ghost" size="sm" className="text-xs text-destructive hover:text-destructive">
              <PowerIcon className="w-4 h-4 mr-2" />
              Shutdown
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

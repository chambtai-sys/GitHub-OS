"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  FolderIcon,
  FileIcon,
  FileTextIcon,
  ImageIcon,
  CodeIcon,
  ArchiveIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  HomeIcon,
  HardDriveIcon,
  SearchIcon,
  PlusIcon,
  MoreHorizontalIcon,
} from "lucide-react"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu"

interface FileSystemItem {
  id: string
  name: string
  type: "file" | "folder"
  size?: number
  modified: Date
  children?: FileSystemItem[]
  expanded?: boolean
}

const mockFileSystem: FileSystemItem[] = [
  {
    id: "1",
    name: "Documents",
    type: "folder",
    modified: new Date(),
    expanded: true,
    children: [
      {
        id: "2",
        name: "Projects",
        type: "folder",
        modified: new Date(),
        expanded: true,
        children: [
          { id: "3", name: "github-os", type: "folder", modified: new Date() },
          { id: "4", name: "portfolio", type: "folder", modified: new Date() },
        ],
      },
      { id: "5", name: "README.md", type: "file", size: 1024, modified: new Date() },
      { id: "6", name: "notes.txt", type: "file", size: 512, modified: new Date() },
    ],
  },
  {
    id: "7",
    name: "Downloads",
    type: "folder",
    modified: new Date(),
    children: [
      { id: "8", name: "image.png", type: "file", size: 2048, modified: new Date() },
      { id: "9", name: "archive.zip", type: "file", size: 4096, modified: new Date() },
    ],
  },
  {
    id: "10",
    name: "Desktop",
    type: "folder",
    modified: new Date(),
    children: [],
  },
]

export function FileManager() {
  const [fileSystem, setFileSystem] = useState<FileSystemItem[]>(mockFileSystem)
  const [currentPath, setCurrentPath] = useState<string[]>(["Home"])
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  const getFileIcon = (item: FileSystemItem) => {
    if (item.type === "folder") return FolderIcon

    const extension = item.name.split(".").pop()?.toLowerCase()
    switch (extension) {
      case "md":
      case "txt":
        return FileTextIcon
      case "png":
      case "jpg":
      case "jpeg":
      case "gif":
        return ImageIcon
      case "js":
      case "ts":
      case "tsx":
      case "jsx":
      case "py":
      case "java":
        return CodeIcon
      case "zip":
      case "rar":
      case "tar":
        return ArchiveIcon
      default:
        return FileIcon
    }
  }

  const formatFileSize = (bytes: number) => {
    const sizes = ["B", "KB", "MB", "GB"]
    if (bytes === 0) return "0 B"
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i]
  }

  const toggleFolder = (itemId: string, items: FileSystemItem[]): FileSystemItem[] => {
    return items.map((item) => {
      if (item.id === itemId && item.type === "folder") {
        return { ...item, expanded: !item.expanded }
      }
      if (item.children) {
        return { ...item, children: toggleFolder(itemId, item.children) }
      }
      return item
    })
  }

  const renderTreeItem = (item: FileSystemItem, level = 0) => {
    const Icon = getFileIcon(item)
    const isSelected = selectedItems.includes(item.id)

    return (
      <div key={item.id}>
        <ContextMenu>
          <ContextMenuTrigger>
            <div
              className={`flex items-center gap-2 px-2 py-1 hover:bg-muted/50 cursor-pointer rounded ${
                isSelected ? "bg-accent/20" : ""
              }`}
              style={{ paddingLeft: `${level * 20 + 8}px` }}
              onClick={() => {
                if (item.type === "folder") {
                  setFileSystem((prev) => toggleFolder(item.id, prev))
                }
                setSelectedItems([item.id])
              }}
            >
              {item.type === "folder" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0"
                  onClick={(e) => {
                    e.stopPropagation()
                    setFileSystem((prev) => toggleFolder(item.id, prev))
                  }}
                >
                  {item.expanded ? <ChevronDownIcon className="h-3 w-3" /> : <ChevronRightIcon className="h-3 w-3" />}
                </Button>
              )}
              <Icon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{item.name}</span>
              {item.type === "file" && item.size && (
                <span className="text-xs text-muted-foreground ml-auto">{formatFileSize(item.size)}</span>
              )}
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>Open</ContextMenuItem>
            <ContextMenuItem>Rename</ContextMenuItem>
            <ContextMenuItem>Copy</ContextMenuItem>
            <ContextMenuItem>Cut</ContextMenuItem>
            <ContextMenuItem className="text-destructive">Delete</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>

        {item.type === "folder" && item.expanded && item.children && (
          <div>{item.children.map((child) => renderTreeItem(child, level + 1))}</div>
        )}
      </div>
    )
  }

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-64 border-r border-border bg-muted/20">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-sm">Quick Access</h3>
        </div>
        <div className="p-2">
          <Button variant="ghost" className="w-full justify-start gap-2 h-8" onClick={() => setCurrentPath(["Home"])}>
            <HomeIcon className="h-4 w-4" />
            Home
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2 h-8">
            <HardDriveIcon className="h-4 w-4" />
            This PC
          </Button>
        </div>
        <div className="p-4 border-t border-border">
          <h3 className="font-semibold text-sm mb-2">Folders</h3>
          <ScrollArea className="h-64">{fileSystem.map((item) => renderTreeItem(item))}</ScrollArea>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center gap-2 p-4 border-b border-border">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            {currentPath.map((path, index) => (
              <div key={index} className="flex items-center gap-1">
                {index > 0 && <ChevronRightIcon className="h-3 w-3" />}
                <span>{path}</span>
              </div>
            ))}
          </div>

          <div className="flex-1" />

          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>

          <Button variant="outline" size="sm">
            <PlusIcon className="h-4 w-4 mr-2" />
            New
          </Button>

          <Button variant="ghost" size="sm">
            <MoreHorizontalIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* File Grid */}
        <ScrollArea className="flex-1 p-4">
          <div className="grid grid-cols-6 gap-4">
            {fileSystem
              .flatMap((item) => [item, ...(item.children || [])])
              .filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((item) => {
                const Icon = getFileIcon(item)
                const isSelected = selectedItems.includes(item.id)

                return (
                  <ContextMenu key={item.id}>
                    <ContextMenuTrigger>
                      <div
                        className={`flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-muted/50 cursor-pointer ${
                          isSelected ? "bg-accent/20" : ""
                        }`}
                        onClick={() => setSelectedItems([item.id])}
                        onDoubleClick={() => {
                          if (item.type === "folder") {
                            setCurrentPath([...currentPath, item.name])
                          }
                        }}
                      >
                        <Icon className="h-8 w-8 text-muted-foreground" />
                        <span className="text-sm text-center break-words">{item.name}</span>
                        {item.type === "file" && item.size && (
                          <span className="text-xs text-muted-foreground">{formatFileSize(item.size)}</span>
                        )}
                      </div>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem>Open</ContextMenuItem>
                      <ContextMenuItem>Rename</ContextMenuItem>
                      <ContextMenuItem>Copy</ContextMenuItem>
                      <ContextMenuItem>Cut</ContextMenuItem>
                      <ContextMenuItem className="text-destructive">Delete</ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                )
              })}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

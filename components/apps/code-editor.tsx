"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileIcon, FolderIcon, SaveIcon, PlayIcon, SettingsIcon, SearchIcon } from "lucide-react"
import { Input } from "@/components/ui/input"

interface CodeFile {
  id: string
  name: string
  path: string
  content: string
  language: string
  isModified: boolean
}

const mockFiles: CodeFile[] = [
  {
    id: "1",
    name: "desktop.tsx",
    path: "components/desktop.tsx",
    content: `import { useState } from "react"
import { Taskbar } from "./taskbar"
import { DesktopIcons } from "./desktop-icons"

export function Desktop() {
  const [openWindows, setOpenWindows] = useState<string[]>([])
  
  return (
    <div className="h-screen w-screen bg-background">
      <DesktopIcons onOpenWindow={setOpenWindows} />
      <Taskbar openWindows={openWindows} />
    </div>
  )
}`,
    language: "typescript",
    isModified: false,
  },
  {
    id: "2",
    name: "terminal.tsx",
    path: "components/apps/terminal.tsx",
    content: `import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"

export function Terminal() {
  const [history, setHistory] = useState<string[]>([])
  
  return (
    <div className="h-full bg-black text-green-400 font-mono">
      <ScrollArea className="h-full p-4">
        {/* Terminal content */}
      </ScrollArea>
    </div>
  )
}`,
    language: "typescript",
    isModified: true,
  },
]

export function CodeEditor() {
  const [openFiles, setOpenFiles] = useState<CodeFile[]>(mockFiles)
  const [activeFile, setActiveFile] = useState(mockFiles[0].id)
  const [searchQuery, setSearchQuery] = useState("")

  const activeFileData = openFiles.find((file) => file.id === activeFile)

  const updateFileContent = (fileId: string, content: string) => {
    setOpenFiles((prev) => prev.map((file) => (file.id === fileId ? { ...file, content, isModified: true } : file)))
  }

  return (
    <div className="flex h-full">
      {/* File Explorer Sidebar */}
      <div className="w-64 border-r border-border bg-muted/20">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-sm mb-2">Explorer</h3>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-8"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2 p-2 text-sm font-medium">
                <FolderIcon className="h-4 w-4" />
                github-os
              </div>
              <div className="ml-4 space-y-1">
                <div className="flex items-center gap-2 p-2 text-sm font-medium">
                  <FolderIcon className="h-4 w-4" />
                  components
                </div>
                <div className="ml-4 space-y-1">
                  {mockFiles
                    .filter((file) => file.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((file) => (
                      <div
                        key={file.id}
                        className={`flex items-center gap-2 p-2 text-sm cursor-pointer hover:bg-muted/50 rounded ${
                          activeFile === file.id ? "bg-accent/20" : ""
                        }`}
                        onClick={() => setActiveFile(file.id)}
                      >
                        <FileIcon className="h-4 w-4" />
                        <span className={file.isModified ? "text-accent" : ""}>{file.name}</span>
                        {file.isModified && <span className="text-accent">•</span>}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Editor Tabs */}
        <div className="flex items-center border-b border-border bg-muted/20">
          {openFiles.map((file) => (
            <div
              key={file.id}
              className={`flex items-center gap-2 px-4 py-2 border-r border-border cursor-pointer ${
                activeFile === file.id ? "bg-background" : "hover:bg-muted/50"
              }`}
              onClick={() => setActiveFile(file.id)}
            >
              <FileIcon className="h-4 w-4" />
              <span className="text-sm">{file.name}</span>
              {file.isModified && <span className="text-accent text-xs">•</span>}
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between p-2 border-b border-border">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <SaveIcon className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm">
              <PlayIcon className="h-4 w-4 mr-2" />
              Run
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{activeFileData?.language} • Line 1, Column 1</span>
            <Button variant="ghost" size="sm">
              <SettingsIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Code Editor */}
        <div className="flex-1">
          {activeFileData && (
            <div className="h-full flex">
              {/* Line Numbers */}
              <div className="w-12 bg-muted/20 border-r border-border p-2 text-right text-sm text-muted-foreground font-mono">
                {activeFileData.content.split("\n").map((_, index) => (
                  <div key={index} className="leading-6">
                    {index + 1}
                  </div>
                ))}
              </div>

              {/* Code Content */}
              <div className="flex-1">
                <textarea
                  value={activeFileData.content}
                  onChange={(e) => updateFileContent(activeFileData.id, e.target.value)}
                  className="w-full h-full p-4 bg-transparent border-none outline-none resize-none font-mono text-sm leading-6"
                  spellCheck={false}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

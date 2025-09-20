"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  GitBranchIcon,
  GitCommitIcon,
  GitPullRequestIcon,
  PlusIcon,
  RefreshCwIcon,
  UploadIcon,
  DownloadIcon,
  FileIcon,
  CheckIcon,
  XIcon,
} from "lucide-react"

interface GitCommit {
  id: string
  message: string
  author: string
  date: Date
  hash: string
}

interface GitBranch {
  name: string
  isActive: boolean
  lastCommit: string
}

interface GitFile {
  name: string
  status: "modified" | "added" | "deleted" | "untracked"
  path: string
}

const mockCommits: GitCommit[] = [
  {
    id: "1",
    message: "Add terminal interface with command execution",
    author: "github-user",
    date: new Date(Date.now() - 1000 * 60 * 30),
    hash: "abc123f",
  },
  {
    id: "2",
    message: "Implement file manager with context menus",
    author: "github-user",
    date: new Date(Date.now() - 1000 * 60 * 60 * 2),
    hash: "def456a",
  },
  {
    id: "3",
    message: "Setup GitHub OS theme and layout",
    author: "github-user",
    date: new Date(Date.now() - 1000 * 60 * 60 * 4),
    hash: "ghi789b",
  },
  {
    id: "4",
    message: "Initial commit - project structure",
    author: "github-user",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24),
    hash: "jkl012c",
  },
]

const mockBranches: GitBranch[] = [
  { name: "main", isActive: true, lastCommit: "abc123f" },
  { name: "develop", isActive: false, lastCommit: "def456a" },
  { name: "feature/terminal", isActive: false, lastCommit: "ghi789b" },
  { name: "feature/file-manager", isActive: false, lastCommit: "jkl012c" },
]

const mockChangedFiles: GitFile[] = [
  { name: "components/apps/terminal.tsx", status: "modified", path: "components/apps/terminal.tsx" },
  { name: "components/desktop.tsx", status: "modified", path: "components/desktop.tsx" },
  { name: "README.md", status: "added", path: "README.md" },
  { name: "old-component.tsx", status: "deleted", path: "components/old-component.tsx" },
]

export function GitManager() {
  const [commitMessage, setCommitMessage] = useState("")
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [currentBranch, setCurrentBranch] = useState("main")

  const getStatusColor = (status: GitFile["status"]) => {
    switch (status) {
      case "modified":
        return "bg-yellow-500"
      case "added":
        return "bg-green-500"
      case "deleted":
        return "bg-red-500"
      case "untracked":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: GitFile["status"]) => {
    switch (status) {
      case "added":
        return <PlusIcon className="h-3 w-3" />
      case "deleted":
        return <XIcon className="h-3 w-3" />
      default:
        return <FileIcon className="h-3 w-3" />
    }
  }

  const toggleFileSelection = (filePath: string) => {
    setSelectedFiles((prev) => (prev.includes(filePath) ? prev.filter((f) => f !== filePath) : [...prev, filePath]))
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">Git Manager</h2>
          <Badge variant="outline" className="flex items-center gap-1">
            <GitBranchIcon className="h-3 w-3" />
            {currentBranch}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCwIcon className="h-4 w-4 mr-2" />
            Fetch
          </Button>
          <Button variant="outline" size="sm">
            <DownloadIcon className="h-4 w-4 mr-2" />
            Pull
          </Button>
          <Button variant="outline" size="sm">
            <UploadIcon className="h-4 w-4 mr-2" />
            Push
          </Button>
        </div>
      </div>

      <Tabs defaultValue="changes" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="changes">Changes</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="branches">Branches</TabsTrigger>
          <TabsTrigger value="remote">Remote</TabsTrigger>
        </TabsList>

        <TabsContent value="changes" className="flex-1 flex flex-col">
          <div className="flex-1 flex">
            {/* Changed Files */}
            <div className="w-1/2 border-r border-border">
              <div className="p-4 border-b border-border">
                <h3 className="font-medium">Changed Files ({mockChangedFiles.length})</h3>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-2">
                  {mockChangedFiles.map((file) => (
                    <div
                      key={file.path}
                      className={`flex items-center gap-3 p-2 rounded hover:bg-muted/50 cursor-pointer ${
                        selectedFiles.includes(file.path) ? "bg-accent/20" : ""
                      }`}
                      onClick={() => toggleFileSelection(file.path)}
                    >
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(file.status)}`} />
                      {getStatusIcon(file.status)}
                      <span className="text-sm flex-1">{file.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {file.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Commit Panel */}
            <div className="w-1/2 flex flex-col">
              <div className="p-4 border-b border-border">
                <h3 className="font-medium">Commit Changes</h3>
              </div>
              <div className="flex-1 p-4 space-y-4">
                <div>
                  <label className="text-sm font-medium">Commit Message</label>
                  <Textarea
                    placeholder="Enter commit message..."
                    value={commitMessage}
                    onChange={(e) => setCommitMessage(e.target.value)}
                    className="mt-2"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Selected Files ({selectedFiles.length})</label>
                  <div className="mt-2 space-y-1">
                    {selectedFiles.map((filePath) => {
                      const file = mockChangedFiles.find((f) => f.path === filePath)
                      return (
                        <div key={filePath} className="flex items-center gap-2 text-sm">
                          <CheckIcon className="h-3 w-3 text-green-500" />
                          <span>{file?.name}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    disabled={!commitMessage.trim() || selectedFiles.length === 0}
                    onClick={() => {
                      // Mock commit action
                      setCommitMessage("")
                      setSelectedFiles([])
                    }}
                  >
                    <GitCommitIcon className="h-4 w-4 mr-2" />
                    Commit
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedFiles(mockChangedFiles.map((f) => f.path))
                    }}
                  >
                    Stage All
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="flex-1">
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              {mockCommits.map((commit) => (
                <div key={commit.id} className="flex items-start gap-4 p-4 border border-border rounded-lg">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    <GitCommitIcon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{commit.message}</span>
                      <Badge variant="outline" className="text-xs">
                        {commit.hash}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {commit.author} • {formatTimeAgo(commit.date)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="branches" className="flex-1">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Branches</h3>
              <Button size="sm">
                <PlusIcon className="h-4 w-4 mr-2" />
                New Branch
              </Button>
            </div>

            <div className="space-y-2">
              {mockBranches.map((branch) => (
                <div
                  key={branch.name}
                  className={`flex items-center justify-between p-3 border border-border rounded-lg ${
                    branch.isActive ? "bg-accent/10 border-accent" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <GitBranchIcon className="h-4 w-4" />
                    <span className="font-medium">{branch.name}</span>
                    {branch.isActive && <Badge variant="secondary">Current</Badge>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{branch.lastCommit}</span>
                    {!branch.isActive && (
                      <Button variant="outline" size="sm" onClick={() => setCurrentBranch(branch.name)}>
                        Checkout
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="remote" className="flex-1">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Remote Repositories</h3>
              <Button size="sm">
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Remote
              </Button>
            </div>

            <div className="space-y-4">
              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">origin</span>
                  <Badge variant="outline">Default</Badge>
                </div>
                <div className="text-sm text-muted-foreground mb-3">https://github.com/user/github-os.git</div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    Fetch
                  </Button>
                  <Button variant="outline" size="sm">
                    <UploadIcon className="h-4 w-4 mr-2" />
                    Push
                  </Button>
                </div>
              </div>

              <div className="p-4 border border-dashed border-border rounded-lg text-center">
                <GitPullRequestIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No pull requests</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

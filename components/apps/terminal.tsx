"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { PlusIcon, XIcon, SettingsIcon } from "lucide-react"

interface TerminalLine {
  id: string
  type: "command" | "output" | "error"
  content: string
  timestamp: Date
}

interface TerminalTab {
  id: string
  name: string
  currentDirectory: string
  history: TerminalLine[]
}

const mockCommands: Record<string, (args: string[]) => string> = {
  help: () => `Available commands:
  help - Show this help message
  ls - List directory contents
  cd - Change directory
  pwd - Print working directory
  mkdir - Create directory
  touch - Create file
  cat - Display file contents
  git - Git commands
  clear - Clear terminal
  whoami - Display current user
  date - Display current date and time`,

  ls: (args) => {
    const files = ["Documents", "Downloads", "Desktop", "Projects", "README.md", "package.json"]
    return files.join("  ")
  },

  pwd: () => "/home/user",

  whoami: () => "github-user",

  date: () => new Date().toString(),

  clear: () => "CLEAR_TERMINAL",

  cd: (args) => {
    if (args.length === 0) return "Usage: cd <directory>"
    return `Changed directory to ${args[0]}`
  },

  mkdir: (args) => {
    if (args.length === 0) return "Usage: mkdir <directory>"
    return `Directory '${args[0]}' created`
  },

  touch: (args) => {
    if (args.length === 0) return "Usage: touch <filename>"
    return `File '${args[0]}' created`
  },

  cat: (args) => {
    if (args.length === 0) return "Usage: cat <filename>"
    return `Contents of ${args[0]}:\nHello, GitHub OS!`
  },

  git: (args) => {
    if (args.length === 0) return "Usage: git <command>"
    const gitCommand = args[0]
    switch (gitCommand) {
      case "status":
        return "On branch main\nYour branch is up to date with 'origin/main'.\n\nnothing to commit, working tree clean"
      case "log":
        return (
          "commit abc123 (HEAD -> main, origin/main)\nAuthor: GitHub User <user@github.com>\nDate: " +
          new Date().toDateString() +
          "\n\n    Initial commit"
        )
      case "branch":
        return "* main\n  develop\n  feature/new-ui"
      default:
        return `git: '${gitCommand}' is not a git command. See 'git --help'.`
    }
  },
}

export function Terminal() {
  const [tabs, setTabs] = useState<TerminalTab[]>([
    {
      id: "1",
      name: "Terminal 1",
      currentDirectory: "/home/user",
      history: [
        {
          id: "welcome",
          type: "output",
          content: "Welcome to GitHub OS Terminal v1.0.0\nType 'help' for available commands.",
          timestamp: new Date(),
        },
      ],
    },
  ])
  const [activeTab, setActiveTab] = useState("1")
  const [currentInput, setCurrentInput] = useState("")
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const activeTabData = tabs.find((tab) => tab.id === activeTab)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [activeTabData?.history])

  const executeCommand = (command: string) => {
    const trimmedCommand = command.trim()
    if (!trimmedCommand) return

    const [cmd, ...args] = trimmedCommand.split(" ")
    const commandFunc = mockCommands[cmd.toLowerCase()]

    const newCommandLine: TerminalLine = {
      id: Date.now().toString(),
      type: "command",
      content: `${activeTabData?.currentDirectory} $ ${trimmedCommand}`,
      timestamp: new Date(),
    }

    let outputLine: TerminalLine | null = null

    if (commandFunc) {
      const output = commandFunc(args)
      if (output === "CLEAR_TERMINAL") {
        setTabs((prev) => prev.map((tab) => (tab.id === activeTab ? { ...tab, history: [] } : tab)))
        return
      }

      outputLine = {
        id: (Date.now() + 1).toString(),
        type: "output",
        content: output,
        timestamp: new Date(),
      }
    } else {
      outputLine = {
        id: (Date.now() + 1).toString(),
        type: "error",
        content: `Command not found: ${cmd}. Type 'help' for available commands.`,
        timestamp: new Date(),
      }
    }

    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === activeTab
          ? {
              ...tab,
              history: [...tab.history, newCommandLine, ...(outputLine ? [outputLine] : [])],
            }
          : tab,
      ),
    )

    setCommandHistory((prev) => [...prev, trimmedCommand])
    setHistoryIndex(-1)
    setCurrentInput("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      executeCommand(currentInput)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1)
        setHistoryIndex(newIndex)
        setCurrentInput(commandHistory[newIndex])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1)
          setCurrentInput("")
        } else {
          setHistoryIndex(newIndex)
          setCurrentInput(commandHistory[newIndex])
        }
      }
    }
  }

  const addNewTab = () => {
    const newTab: TerminalTab = {
      id: Date.now().toString(),
      name: `Terminal ${tabs.length + 1}`,
      currentDirectory: "/home/user",
      history: [
        {
          id: "welcome",
          type: "output",
          content: "Welcome to GitHub OS Terminal v1.0.0\nType 'help' for available commands.",
          timestamp: new Date(),
        },
      ],
    }
    setTabs([...tabs, newTab])
    setActiveTab(newTab.id)
  }

  const closeTab = (tabId: string) => {
    if (tabs.length === 1) return
    const newTabs = tabs.filter((tab) => tab.id !== tabId)
    setTabs(newTabs)
    if (activeTab === tabId) {
      setActiveTab(newTabs[0].id)
    }
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Tab Bar */}
      <div className="flex items-center bg-muted/20 border-b border-border">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`flex items-center gap-2 px-4 py-2 border-r border-border cursor-pointer ${
              activeTab === tab.id ? "bg-background" : "hover:bg-muted/50"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="text-sm">{tab.name}</span>
            {tabs.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                onClick={(e) => {
                  e.stopPropagation()
                  closeTab(tab.id)
                }}
              >
                <XIcon className="h-3 w-3" />
              </Button>
            )}
          </div>
        ))}

        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 mx-2" onClick={addNewTab}>
          <PlusIcon className="h-4 w-4" />
        </Button>

        <div className="flex-1" />

        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 mx-2">
          <SettingsIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* Terminal Content */}
      <div className="flex-1 flex flex-col font-mono text-sm">
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-1">
            {activeTabData?.history.map((line) => (
              <div
                key={line.id}
                className={`whitespace-pre-wrap ${
                  line.type === "command"
                    ? "text-accent"
                    : line.type === "error"
                      ? "text-destructive"
                      : "text-foreground"
                }`}
              >
                {line.content}
              </div>
            ))}

            {/* Current Input Line */}
            <div className="flex items-center gap-2">
              <span className="text-accent">{activeTabData?.currentDirectory} $</span>
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent border-none outline-none text-foreground"
                autoFocus
              />
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

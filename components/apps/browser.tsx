"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeftIcon, ArrowRightIcon, RefreshCwIcon, HomeIcon, BookmarkIcon, MoreHorizontalIcon } from "lucide-react"

export function Browser() {
  const [url, setUrl] = useState("https://github.com")
  const [history, setHistory] = useState(["https://github.com"])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [bookmarks] = useState([
    { title: "GitHub", url: "https://github.com" },
    { title: "Vercel", url: "https://vercel.com" },
    { title: "Next.js", url: "https://nextjs.org" },
    { title: "TypeScript", url: "https://typescriptlang.org" },
  ])

  const navigateTo = (newUrl: string) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newUrl)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
    setUrl(newUrl)
  }

  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setUrl(history[historyIndex - 1])
    }
  }

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setUrl(history[historyIndex + 1])
    }
  }

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigateTo(url)
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Browser Toolbar */}
      <div className="flex items-center gap-2 p-2 border-b bg-muted/30">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={goBack} disabled={historyIndex === 0} className="h-8 w-8 p-0">
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={goForward}
            disabled={historyIndex === history.length - 1}
            className="h-8 w-8 p-0"
          >
            <ArrowRightIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <RefreshCwIcon className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleUrlSubmit} className="flex-1 flex items-center gap-2">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 h-8 text-sm"
            placeholder="Enter URL or search..."
          />
        </form>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <BookmarkIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontalIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Bookmarks Bar */}
      <div className="flex items-center gap-1 p-2 border-b bg-muted/20">
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
          <HomeIcon className="h-3 w-3 mr-1" />
          Home
        </Button>
        {bookmarks.map((bookmark, index) => (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => navigateTo(bookmark.url)}
          >
            {bookmark.title}
          </Button>
        ))}
      </div>

      {/* Browser Content */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-4">
            <div className="text-6xl">🌐</div>
            <h1 className="text-3xl font-bold">GitHub OS Browser</h1>
            <p className="text-muted-foreground">A simulated browser experience within GitHub OS</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Current URL</h3>
              <code className="text-sm bg-muted p-2 rounded block">{url}</code>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Browser Features</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Navigation controls</li>
                <li>• URL bar with history</li>
                <li>• Bookmarks bar</li>
                <li>• Responsive design</li>
              </ul>
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Quick Links</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {bookmarks.map((bookmark, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => navigateTo(bookmark.url)}
                  className="justify-start"
                >
                  {bookmark.title}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

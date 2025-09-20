"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PlusIcon, SearchIcon, TrashIcon, EditIcon, SaveIcon, FileTextIcon } from "lucide-react"

interface Note {
  id: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
}

export function Notes() {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      title: "GitHub OS Development",
      content:
        "Building a web-based operating system with React and Next.js. Key features include:\n\n- Desktop environment\n- Window management\n- File system simulation\n- Terminal emulation\n- Code editor integration",
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-15"),
    },
    {
      id: "2",
      title: "Project Ideas",
      content:
        "Ideas for future projects:\n\n1. Real-time chat application\n2. Task management system\n3. Code snippet manager\n4. Portfolio website\n5. Blog platform",
      createdAt: new Date("2024-01-16"),
      updatedAt: new Date("2024-01-16"),
    },
  ])

  const [selectedNote, setSelectedNote] = useState<string | null>(notes[0]?.id || null)
  const [isEditing, setIsEditing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [editTitle, setEditTitle] = useState("")
  const [editContent, setEditContent] = useState("")

  const currentNote = notes.find((note) => note.id === selectedNote)

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "New Note",
      content: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setNotes([newNote, ...notes])
    setSelectedNote(newNote.id)
    setIsEditing(true)
    setEditTitle(newNote.title)
    setEditContent(newNote.content)
  }

  const startEditing = () => {
    if (currentNote) {
      setIsEditing(true)
      setEditTitle(currentNote.title)
      setEditContent(currentNote.content)
    }
  }

  const saveNote = () => {
    if (currentNote) {
      setNotes(
        notes.map((note) =>
          note.id === currentNote.id
            ? { ...note, title: editTitle, content: editContent, updatedAt: new Date() }
            : note,
        ),
      )
      setIsEditing(false)
    }
  }

  const deleteNote = (noteId: string) => {
    setNotes(notes.filter((note) => note.id !== noteId))
    if (selectedNote === noteId) {
      setSelectedNote(notes.find((note) => note.id !== noteId)?.id || null)
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex h-full bg-background">
      {/* Sidebar */}
      <div className="w-80 border-r bg-muted/30 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Notes</h2>
            <Button size="sm" onClick={createNewNote}>
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>

          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-auto">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className={`p-3 border-b cursor-pointer hover:bg-muted/50 ${selectedNote === note.id ? "bg-muted" : ""}`}
              onClick={() => setSelectedNote(note.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{note.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{note.content || "No content"}</p>
                  <p className="text-xs text-muted-foreground mt-2">{formatDate(note.updatedAt)}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteNote(note.id)
                  }}
                >
                  <TrashIcon className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {currentNote ? (
          <>
            {/* Note Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex-1">
                {isEditing ? (
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="font-medium text-lg"
                  />
                ) : (
                  <h1 className="font-medium text-lg">{currentNote.title}</h1>
                )}
                <p className="text-sm text-muted-foreground mt-1">Last updated: {formatDate(currentNote.updatedAt)}</p>
              </div>

              <div className="flex gap-2">
                {isEditing ? (
                  <Button size="sm" onClick={saveNote}>
                    <SaveIcon className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" onClick={startEditing}>
                    <EditIcon className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )}
                <Button size="sm" variant="outline" onClick={() => deleteNote(currentNote.id)}>
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Note Content */}
            <div className="flex-1 p-4">
              {isEditing ? (
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full h-full resize-none font-mono text-sm"
                  placeholder="Start writing your note..."
                />
              ) : (
                <div className="h-full">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {currentNote.content || "This note is empty. Click Edit to add content."}
                  </pre>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <FileTextIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select a note to view its contents</p>
              <Button className="mt-4" onClick={createNewNote}>
                Create your first note
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { DatabaseIcon, TableIcon, PlayIcon, SaveIcon, PlusIcon, TrashIcon } from "lucide-react"

interface Table {
  name: string
  columns: string[]
  rows: Record<string, any>[]
}

export function Database() {
  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  const [query, setQuery] = useState("SELECT * FROM users;")
  const [queryResult, setQueryResult] = useState<any[] | null>(null)
  const [tables, setTables] = useState<Table[]>([
    {
      name: "users",
      columns: ["id", "name", "email", "created_at"],
      rows: [
        { id: 1, name: "John Doe", email: "john@example.com", created_at: "2024-01-15" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", created_at: "2024-01-16" },
        { id: 3, name: "Bob Johnson", email: "bob@example.com", created_at: "2024-01-17" },
      ],
    },
    {
      name: "projects",
      columns: ["id", "name", "description", "owner_id"],
      rows: [
        { id: 1, name: "GitHub OS", description: "Web-based operating system", owner_id: 1 },
        { id: 2, name: "Chat App", description: "Real-time messaging", owner_id: 2 },
      ],
    },
  ])

  const executeQuery = () => {
    const lowerQuery = query.toLowerCase().trim()

    if (lowerQuery.startsWith("select")) {
      // Simple SELECT simulation
      const tableMatch = lowerQuery.match(/from\s+(\w+)/)
      if (tableMatch) {
        const tableName = tableMatch[1]
        const table = tables.find((t) => t.name === tableName)
        if (table) {
          setQueryResult(table.rows)
        } else {
          setQueryResult([{ error: `Table '${tableName}' not found` }])
        }
      }
    } else {
      setQueryResult([{ message: "Query executed successfully" }])
    }
  }

  const currentTable = selectedTable ? tables.find((t) => t.name === selectedTable) : null

  return (
    <div className="flex h-full bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r bg-muted/30 p-4">
        <div className="flex items-center gap-2 mb-4">
          <DatabaseIcon className="h-5 w-5" />
          <h2 className="font-semibold">Database</h2>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">Tables</div>
          {tables.map((table) => (
            <Button
              key={table.name}
              variant={selectedTable === table.name ? "secondary" : "ghost"}
              size="sm"
              className="w-full justify-start"
              onClick={() => setSelectedTable(table.name)}
            >
              <TableIcon className="h-4 w-4 mr-2" />
              {table.name}
              <span className="ml-auto text-xs text-muted-foreground">{table.rows.length}</span>
            </Button>
          ))}
        </div>

        <div className="mt-6 space-y-2">
          <Button size="sm" className="w-full">
            <PlusIcon className="h-4 w-4 mr-2" />
            New Table
          </Button>
          <Button variant="outline" size="sm" className="w-full bg-transparent">
            <SaveIcon className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Query Editor */}
        <div className="border-b p-4">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-medium">SQL Query</h3>
            <Button size="sm" onClick={executeQuery}>
              <PlayIcon className="h-4 w-4 mr-2" />
              Execute
            </Button>
          </div>
          <Textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="font-mono text-sm"
            rows={3}
            placeholder="Enter your SQL query here..."
          />
        </div>

        {/* Results/Table View */}
        <div className="flex-1 p-4 overflow-auto">
          {queryResult ? (
            <div>
              <h3 className="font-medium mb-2">Query Results</h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      {queryResult.length > 0 &&
                        Object.keys(queryResult[0]).map((key) => (
                          <th key={key} className="text-left p-2 font-medium">
                            {key}
                          </th>
                        ))}
                    </tr>
                  </thead>
                  <tbody>
                    {queryResult.map((row, index) => (
                      <tr key={index} className="border-t">
                        {Object.values(row).map((value, cellIndex) => (
                          <td key={cellIndex} className="p-2 text-sm">
                            {String(value)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : currentTable ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Table: {currentTable.name}</h3>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Row
                  </Button>
                  <Button size="sm" variant="outline">
                    <TrashIcon className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      {currentTable.columns.map((column) => (
                        <th key={column} className="text-left p-2 font-medium">
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentTable.rows.map((row, index) => (
                      <tr key={index} className="border-t hover:bg-muted/50">
                        {currentTable.columns.map((column) => (
                          <td key={column} className="p-2 text-sm">
                            {String(row[column] || "")}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <DatabaseIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a table to view its contents</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

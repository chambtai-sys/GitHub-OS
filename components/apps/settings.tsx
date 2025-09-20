"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { SettingsIcon, UserIcon, PaletteIcon, MonitorIcon, ShieldIcon, InfoIcon } from "lucide-react"

export function Settings() {
  const [settings, setSettings] = useState({
    // Appearance
    theme: "dark",
    accentColor: "blue",
    fontSize: [14],
    animations: true,

    // System
    notifications: true,
    soundEffects: true,
    autoSave: true,

    // User
    username: "github-user",
    email: "user@github-os.dev",

    // Privacy
    analytics: false,
    crashReports: true,
  })

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const settingsSections = [
    {
      id: "appearance",
      title: "Appearance",
      icon: PaletteIcon,
      settings: [
        {
          key: "theme",
          label: "Theme",
          type: "select",
          options: [
            { value: "light", label: "Light" },
            { value: "dark", label: "Dark" },
            { value: "system", label: "System" },
          ],
        },
        {
          key: "accentColor",
          label: "Accent Color",
          type: "select",
          options: [
            { value: "blue", label: "Blue" },
            { value: "green", label: "Green" },
            { value: "purple", label: "Purple" },
            { value: "orange", label: "Orange" },
          ],
        },
        {
          key: "fontSize",
          label: "Font Size",
          type: "slider",
          min: 12,
          max: 18,
          step: 1,
        },
        {
          key: "animations",
          label: "Enable Animations",
          type: "switch",
        },
      ],
    },
    {
      id: "system",
      title: "System",
      icon: MonitorIcon,
      settings: [
        {
          key: "notifications",
          label: "Show Notifications",
          type: "switch",
        },
        {
          key: "soundEffects",
          label: "Sound Effects",
          type: "switch",
        },
        {
          key: "autoSave",
          label: "Auto-save Documents",
          type: "switch",
        },
      ],
    },
    {
      id: "account",
      title: "Account",
      icon: UserIcon,
      settings: [
        {
          key: "username",
          label: "Username",
          type: "input",
        },
        {
          key: "email",
          label: "Email",
          type: "input",
        },
      ],
    },
    {
      id: "privacy",
      title: "Privacy & Security",
      icon: ShieldIcon,
      settings: [
        {
          key: "analytics",
          label: "Share Analytics Data",
          type: "switch",
        },
        {
          key: "crashReports",
          label: "Send Crash Reports",
          type: "switch",
        },
      ],
    },
  ]

  const [activeSection, setActiveSection] = useState("appearance")

  const renderSetting = (setting: any) => {
    const value = settings[setting.key as keyof typeof settings]

    switch (setting.type) {
      case "switch":
        return (
          <div className="flex items-center justify-between">
            <Label htmlFor={setting.key}>{setting.label}</Label>
            <Switch
              id={setting.key}
              checked={value as boolean}
              onCheckedChange={(checked) => updateSetting(setting.key, checked)}
            />
          </div>
        )

      case "select":
        return (
          <div className="space-y-2">
            <Label>{setting.label}</Label>
            <Select value={value as string} onValueChange={(val) => updateSetting(setting.key, val)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {setting.options.map((option: any) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )

      case "slider":
        return (
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>{setting.label}</Label>
              <span className="text-sm text-muted-foreground">{(value as number[])[0]}px</span>
            </div>
            <Slider
              value={value as number[]}
              onValueChange={(val) => updateSetting(setting.key, val)}
              min={setting.min}
              max={setting.max}
              step={setting.step}
              className="w-full"
            />
          </div>
        )

      case "input":
        return (
          <div className="space-y-2">
            <Label htmlFor={setting.key}>{setting.label}</Label>
            <Input
              id={setting.key}
              value={value as string}
              onChange={(e) => updateSetting(setting.key, e.target.value)}
            />
          </div>
        )

      default:
        return null
    }
  }

  const activeSettings = settingsSections.find((section) => section.id === activeSection)

  return (
    <div className="flex h-full bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r bg-muted/30 p-4">
        <div className="flex items-center gap-2 mb-6">
          <SettingsIcon className="h-5 w-5" />
          <h2 className="font-semibold">Settings</h2>
        </div>

        <div className="space-y-1">
          {settingsSections.map((section) => {
            const Icon = section.icon
            return (
              <Button
                key={section.id}
                variant={activeSection === section.id ? "secondary" : "ghost"}
                size="sm"
                className="w-full justify-start"
                onClick={() => setActiveSection(section.id)}
              >
                <Icon className="h-4 w-4 mr-2" />
                {section.title}
              </Button>
            )
          })}
        </div>

        <div className="mt-8 pt-4 border-t">
          <Button variant="outline" size="sm" className="w-full bg-transparent">
            <InfoIcon className="h-4 w-4 mr-2" />
            About GitHub OS
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        {activeSettings && (
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <activeSettings.icon className="h-6 w-6" />
              <h1 className="text-2xl font-bold">{activeSettings.title}</h1>
            </div>

            <div className="space-y-6">
              {activeSettings.settings.map((setting) => (
                <div key={setting.key} className="p-4 border rounded-lg">
                  {renderSetting(setting)}
                </div>
              ))}
            </div>

            <div className="mt-8 flex gap-3">
              <Button>Save Changes</Button>
              <Button variant="outline">Reset to Defaults</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

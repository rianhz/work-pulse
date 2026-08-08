"use client"

// --- UI Primitives ---
import { Button } from "@/components/tiptap/tiptap-ui-primitive/button"

// --- Icons ---
import { MoonStarIcon } from "@/components/tiptap/tiptap-icons/moon-star-icon"
import { SunIcon } from "@/components/tiptap/tiptap-icons/sun-icon"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme } = useTheme()
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true)


  useEffect(() => {
    const mediaQuery = window.matchMedia(`(prefers-color-scheme: ${theme})`)
    const handleChange = () => setIsDarkMode(mediaQuery.matches)
    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  useEffect(() => {
    const initialDarkMode =
      !!document.querySelector(`meta[name="color-scheme"][content="${theme}"]`) ||
      window.matchMedia(`(prefers-color-scheme: ${theme})`).matches
    setIsDarkMode(initialDarkMode)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle(`${theme}`, isDarkMode)
  }, [isDarkMode])

  const toggleDarkMode = () => setIsDarkMode((isDark) => !isDark)

  return (
    <Button
      onClick={toggleDarkMode}
      aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
      variant="ghost"
    >
      {isDarkMode ? (
        <MoonStarIcon className="tiptap-button-icon" />
      ) : (
        <SunIcon className="tiptap-button-icon" />
      )}
    </Button>
  )
}

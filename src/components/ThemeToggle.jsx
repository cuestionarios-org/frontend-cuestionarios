// src/components/ThemeToggle.jsx
import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle() {
  const { darkMode, setDarkMode } = useTheme()

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
    >
      {darkMode ? '🌞' : '🌙'}
    </button>
  )
}
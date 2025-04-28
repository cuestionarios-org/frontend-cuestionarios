// src/components/Loader.jsx
export default function Loader({ className = '', size = 12 }) {
    const spinnerSize = `h-${size} w-${size}`
  
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div
          className={`animate-spin rounded-full border-t-4 border-b-4
                      border-blue-500 dark:border-blue-400 ${spinnerSize}`}
        />
      </div>
    )
  }
  
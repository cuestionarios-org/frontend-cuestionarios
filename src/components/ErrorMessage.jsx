// src/components/ErrorMessage.jsx
import { FaExclamationTriangle } from 'react-icons/fa'

export default function ErrorMessage({ message }) {
  return (
    <div className="flex items-center justify-center bg-red-500 text-white p-4 rounded-lg shadow-md">
      <FaExclamationTriangle className="mr-3 text-2xl" />
      <span>{message}</span>
    </div>
  )
}

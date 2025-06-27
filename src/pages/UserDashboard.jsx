import React from 'react'

export default function UserDashboard() {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Bienvenido 👋</h1>
      <p className="text-gray-700 dark:text-gray-300 mb-2">
        Aquí podrás ver tus competencias, inscribirte y consultar resultados.
      </p>
      <p className="text-gray-700 dark:text-gray-300">
        Usa el menú superior para navegar por la plataforma.
      </p>
    </div>
  )
}

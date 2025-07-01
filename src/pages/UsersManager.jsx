import React, { useEffect, useState } from 'react';
import { userService } from '../services/api';

export default function UsersManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    userService.getAll()
      .then(res => setUsers(res.data.users || []))
      .catch(() => setError('No se pudieron cargar los usuarios.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Usuarios</h2>
      {loading && <div className="text-gray-500">Cargando...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-900">
                <th className="px-2 py-2 text-left text-gray-700 dark:text-white">ID</th>
                <th className="px-2 py-2 text-left text-gray-700 dark:text-white">Usuario</th>
                <th className="px-2 py-2 text-left text-gray-700 dark:text-white">Correo</th>
                <th className="px-2 py-2 text-left text-gray-700 dark:text-white">Rol</th>
                <th className="px-2 py-2 text-left text-gray-700 dark:text-white">Estado</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && (
                <tr><td colSpan={5} className="text-center text-gray-500 py-4">No hay usuarios.</td></tr>
              )}
              {users.map(u => (
                <tr key={u.id} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-2 py-2 text-gray-900 dark:text-white">{u.id}</td>
                  <td className="px-2 py-2 text-gray-900 dark:text-white">{u.username || '-'}</td>
                  <td className="px-2 py-2 text-gray-900 dark:text-white">{u.email || '-'}</td>
                  <td className="px-2 py-2 text-gray-900 dark:text-white">{u.role || '-'}</td>
                  <td className="px-2 py-2 text-gray-900 dark:text-white">{u.state || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

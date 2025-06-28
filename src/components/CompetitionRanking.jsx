import React from 'react';

export default function CompetitionRanking({ participants }) {
  const sorted = [...participants].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Ranking general</h2>
      <div className="overflow-x-auto">
        <table className="min-w-[220px] text-xs border border-gray-200 dark:border-gray-700 rounded">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="px-2 py-1 text-left text-gray-700 dark:text-white">#</th>
              <th className="px-2 py-1 text-left text-gray-700 dark:text-white">Usuario</th>
              <th className="px-2 py-1 text-left text-gray-700 dark:text-white">Score</th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr><td colSpan={3} className="italic text-gray-400 dark:text-gray-400 ml-4">Sin inscriptos</td></tr>
            ) : (
              sorted.map((p, idx) => (
                <tr key={p.participant_id || p.id || idx} className="border-t border-gray-100 dark:border-gray-800">
                  <td className="px-2 py-1 text-gray-900 dark:text-gray-100">{idx + 1}</td>
                  <td className="px-2 py-1 text-gray-900 dark:text-gray-100">{p.username || p.email || p.participant_id}</td>
                  <td className="px-2 py-1 text-gray-900 dark:text-gray-100">{typeof p.score === 'number' ? p.score : '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

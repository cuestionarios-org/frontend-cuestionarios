import React from 'react';

export default function QuizTimer({ seconds }) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return (
    <div className="mb-4 text-center">
      <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded text-lg font-mono">
        {min}:{sec.toString().padStart(2, '0')}
      </span>
    </div>
  );
}

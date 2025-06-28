import React from 'react';

export default function QuestionCard({ question, value, onChange }) {
  if (!question) return null;
  return (
    <div className="mb-4">
      <div className="font-semibold text-gray-800 dark:text-white mb-2">{question.text}</div>
      <div className="flex flex-col gap-2">
        {question.options && question.options.map(opt => (
          <label key={opt.id} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={`q_${question.id}`}
              value={opt.id}
              checked={value === opt.id}
              onChange={() => onChange(opt.id)}
              className="accent-blue-600"
            />
            <span className="text-gray-900 dark:text-gray-200">{opt.text}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
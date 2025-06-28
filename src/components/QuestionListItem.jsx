import React from 'react';

const stateLabels = {
  draft: { label: 'Borrador', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
  published: { label: 'Lista', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  deleted: { label: 'Eliminada', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
};

export default function QuestionListItem({ q, categories, onEdit, onChangeStatus }) {
  const { question, answers } = q;
  const category = categories.find(cat => cat.id === question.category_id);
  const stateInfo = stateLabels[question.state] || { label: question.state, color: 'bg-gray-200 text-gray-700' };

  return (
    <li className="p-4 bg-gray-50 dark:bg-gray-900 rounded shadow border border-gray-200 dark:border-gray-700 relative">
      {/* Badge ID arriba derecha */}
      <span className="absolute top-2 right-2 px-2 py-0.5 text-xs font-semibold rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border border-blue-300 dark:border-blue-700">
        ID: {question.id}
      </span>
      <div className="flex items-center gap-2 mb-2">
        {/* Badge categoría */}
        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600">
          {category ? category.name : 'Sin categoría'}
        </span>
        {/* Badge ID */}
        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
          #{question.id}
        </span>
        {/* Badge estado */}
        <span className={`px-2 py-0.5 rounded text-xs font-bold border ${stateInfo.color} border-gray-300 dark:border-gray-700`}>
          {stateInfo.label}
        </span>
      </div>
      <div className="font-semibold text-gray-900 dark:text-white mb-1">{question.text}</div>
      <ul className="mt-2 ml-2 list-disc text-sm">
        {answers.map(a => (
          <li key={a.id} className={a.is_correct ? 'font-bold text-green-700 dark:text-green-400' : 'text-gray-800 dark:text-gray-200'}>
            {a.text} {a.is_correct && <span className="ml-1">✔</span>}
          </li>
        ))}
      </ul>
      <div className="flex gap-2 justify-end mt-4">
        <button
          className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
          onClick={() => onEdit(q)}
        >Editar</button>
        <button
          className="px-2 py-1 bg-gray-400 text-white rounded text-xs hover:bg-gray-500"
          onClick={() => onChangeStatus(q)}
        >
          {question.state === 'draft' ? 'Publicar' : question.state === 'published' ? 'Eliminar' : 'Restaurar'}
        </button>
      </div>
    </li>
  );
}

export default function QuestionCard({ q, categories, onEdit, onChangeStatus }) {
  return (
    <li className="relative p-4 bg-gray-100 dark:bg-gray-700 rounded shadow">
      <div className="absolute top-2 left-3 flex gap-2">
        <span className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 text-xs px-2 py-0.5 rounded">
          {categories.find(cat => cat.id === q.question.category_id)?.name || 'Sin categoría'}
        </span>
        <span className={`text-xs font-bold px-2 py-0.5 rounded
          ${q.question.state === 'published' ? 'bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200'
            : q.question.state === 'draft' ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
            : 'bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
          {q.question.state}
        </span>
      </div>
      <span className="absolute top-2 right-3 bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs font-bold px-2 py-0.5 rounded">
        ID: {q.question.id}
      </span>
      <div className="font-medium text-gray-800 dark:text-gray-100 mt-10">{q.question.text}</div>
      {q.answers && (
        <ul className="mt-2 ml-4 list-disc text-gray-700 dark:text-gray-200">
          {q.answers.map(a => (
            <li key={a.id}>
              {a.text} {a.is_correct && <span className="text-green-600 font-bold">(Correcta)</span>}
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-2 justify-end mt-4">
        <button
          className="text-xs px-2 py-1 bg-yellow-200 text-yellow-800 rounded hover:bg-yellow-300"
          onClick={() => onEdit(q)}
        >
          Editar
        </button>
        <button
          className={`text-xs px-2 py-1 rounded transition ${
            q.question.state === 'published'
              ? 'bg-red-200 text-red-800 hover:bg-red-300'
              : 'bg-green-200 text-green-800 hover:bg-green-300'
          }`}
          onClick={() => onChangeStatus(q)}
        >
          {q.question.state === 'published'
            ? 'Marcar como eliminada'
            : q.question.state === 'draft'
            ? 'Publicar'
            : 'Eliminada'}
        </button>
      </div>
    </li>
  )
}
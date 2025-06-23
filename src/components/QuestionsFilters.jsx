export default function QuestionsFilters({ categories, filterCategory, setFilterCategory, filterState, setFilterState }) {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Filtrar por categoría
        </label>
        <select
          className="p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
        >
          <option value="">Todas</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Filtrar por estado
        </label>
        <select
          className="p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          value={filterState}
          onChange={e => setFilterState(e.target.value)}
        >
          <option value="">Todos</option>
          <option value="published">Publicado</option>
          <option value="draft">Borrador</option>
          <option value="deleted">Eliminado</option>
        </select>
      </div>
    </div>
  )
}
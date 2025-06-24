import React from 'react'
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'

function SortableAnswer({answer, idx, onAnswerChange, removeAnswer, answers}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({id: `answer-${idx}`})

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 'auto',
    border: idx === 0 ? '2px solid #22c55e' : '1px solid #e5e7eb', // verde para correcta, gris para el resto
    fontWeight: idx === 0 ? 'bold' : undefined,
    background: undefined // fondo igual para todos
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 p-1 rounded transition ${isDragging ? 'shadow-lg' : ''}`}
      {...attributes}
    >
      {/* Drag handle */}
      <span {...listeners} className="cursor-move select-none px-2 text-gray-400 hover:text-blue-600">☰</span>
      <input
        className="flex-1 p-2 rounded border border-gray-300 dark:border-gray-600 bg-transparent text-gray-900 dark:text-gray-100 focus:outline-none"
        name={`answer-${idx}-text`}
        value={answer.text}
        onChange={e => onAnswerChange(idx, 'text', e.target.value)}
        placeholder={`Respuesta ${idx + 1}${idx === 0 ? ' (Correcta)' : ''}`}
      />
      <button
        type="button"
        disabled={idx === 0 || answers.filter(a => a.text.trim() !== '').length <= 2}
        onClick={() => removeAnswer(idx)}
        className="ml-2 text-red-500 hover:text-red-700 disabled:opacity-30"
        title="Eliminar"
      >✖</button>
    </div>
  )
}

export default function QuestionForm({
  form,
  categories,
  formRef,
  handleFormChange,
  handleSubmit,
  handleCloseForm,
  editingId
}) {
  // Solo cuenta respuestas con texto
  const filledCount = form.answers.filter(a => a.text.trim() !== '').length
  const isValid = filledCount >= 2

  // Asegura que siempre haya 5 respuestas en el array
  const answers = React.useMemo(() => {
    const arr = [...form.answers]
    while (arr.length < 5) arr.push({ text: '', is_correct: false })
    return arr.slice(0, 5)
  }, [form.answers])

  // Handler para cambiar texto
  const onAnswerChange = (idx, field, value) => {
    handleFormChange({
      target: {
        name: `answer-${idx}-${field}`,
        value,
        type: 'text'
      }
    })
  }

  // Eliminar respuesta (no la correcta, mínimo 2 con texto)
  const removeAnswer = (idx) => {
    if (idx === 0) return // No se puede borrar la correcta
    const filled = answers.filter(a => a.text.trim() !== '')
    if (filled.length <= 2) return // Mínimo 2 respuestas
    const newAnswers = answers.filter((_, i) => i !== idx)
    while (newAnswers.length < 5) newAnswers.push({ text: '', is_correct: false })
    newAnswers.forEach((a, i) => a.is_correct = i === 0)
    handleFormChange({
      target: {
        name: 'answers',
        value: newAnswers,
        type: 'custom'
      }
    })
  }

  // DnD Kit
  const sensors = useSensors(useSensor(PointerSensor))
  const ids = answers.map((_, idx) => `answer-${idx}`)

  const handleDragEnd = (event) => {
    const {active, over} = event
    if (!over || active.id === over.id) return
    const oldIdx = ids.indexOf(active.id)
    const newIdx = ids.indexOf(over.id)
    if (oldIdx === -1 || newIdx === -1) return
    const newAnswers = arrayMove(answers, oldIdx, newIdx)
    newAnswers.forEach((a, i) => a.is_correct = i === 0)
    handleFormChange({
      target: {
        name: 'answers',
        value: newAnswers,
        type: 'custom'
      }
    })
  }

  // Evitar scroll de fondo cuando el modal está abierto
  React.useEffect(() => {
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = original }
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg md:max-w-xl border border-gray-200 dark:border-gray-700 relative max-h-[90vh] overflow-y-auto">
        {/* Botón de cierre eliminado */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <input
              className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
              name="text"
              value={form.question.text}
              onChange={handleFormChange}
              required
              placeholder="Texto de la pregunta"
            />
          </div>
          <div>
            <select
              className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
              name="category_id"
              value={form.question.category_id}
              onChange={handleFormChange}
              required
            >
              <option value="">Selecciona una categoría</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
              Respuestas
            </label>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={ids} strategy={verticalListSortingStrategy}>
                {answers.map((answer, idx) => (
                  <SortableAnswer
                    key={idx}
                    answer={answer}
                    idx={idx}
                    onAnswerChange={onAnswerChange}
                    removeAnswer={removeAnswer}
                    answers={answers}
                  />
                ))}
              </SortableContext>
            </DndContext>
            <div className="text-xs text-gray-500 mt-1">
              La <b>primera respuesta</b> es la correcta. Mínimo 2 respuestas.
              Puedes arrastrar para cambiar el orden.
            </div>
            {!isValid && (
              <div className="text-xs text-red-500 mt-1">
                Debes ingresar al menos dos respuestas.
              </div>
            )}
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              disabled={!isValid}
            >
              {editingId ? 'Guardar cambios' : 'Agregar'}
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
              onClick={handleCloseForm}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
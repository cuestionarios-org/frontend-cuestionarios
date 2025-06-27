import React, { useState, useEffect } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { es } from 'date-fns/locale';
import QuizzesSelector from './QuizzesSelector';

const initialState = {
  title: '',
  description: '',
  state: 'preparacion',
  start_date: '',
  end_date: '',
  participant_limit: 0,
  currency_cost: 0,
  ticket_cost: 0,
  credit_cost: 0,
};

const states = [
  { value: 'preparacion', label: 'Preparación' },
  { value: 'lista', label: 'Lista' },
  { value: 'en curso', label: 'En curso' },
  { value: 'cerrada', label: 'Cerrada' },
  { value: 'finalizada', label: 'Finalizada' },
];

export default function CompetitionForm({ initialData, onSubmit, loading, open, onClose }) {
  const [form, setForm] = useState(initialState);
  const [dateError, setDateError] = useState('');
  const [selectedQuizzes, setSelectedQuizzes] = useState([]);

  useEffect(() => {
    if (open) {
      if (initialData) {
        setForm({ ...initialState, ...initialData });
        setSelectedQuizzes(initialData.quizzes ? initialData.quizzes.map(q => q.quiz_id || q.id) : []);
      } else {
        setForm(initialState);
        setSelectedQuizzes([]);
      }
    }
  }, [open, initialData]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const handleChange = (e) => {
    const { name, value, type } = e.target || {};
    let val = value;
    if (value instanceof Date && !isNaN(value)) {
      val = value.toISOString();
    }
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(val) : val,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validación de fechas
    if (!form.start_date || !form.end_date) {
      setDateError('Debes seleccionar ambas fechas.');
      return;
    }
    const start = new Date(form.start_date);
    const end = new Date(form.end_date);
    if (isNaN(start) || isNaN(end) || end <= start) {
      setDateError('La fecha final debe ser mayor que la fecha inicial.');
      return;
    }
    setDateError('');
    // Enviar quizzes seleccionados en el formato requerido
    const quizzesArr = selectedQuizzes.map(id => ({ quiz_id: id }));
    onSubmit({ ...form, quizzes: quizzesArr });
  };

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-2xl relative">
        {initialData?.id && (
          <span className="absolute top-4 right-4 px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border border-blue-300 dark:border-blue-700">
            ID: {initialData.id}
          </span>
        )}
        <form onSubmit={handleSubmit} className="competition-form space-y-4">
          <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">{initialData ? 'Editar' : 'Nueva'} Competencia</h2>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            placeholder="Título de la competencia*"
            className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Descripción (opcional)"
            className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          />
          <div className="flex gap-4">
            <select
              name="state"
              value={form.state}
              onChange={handleChange}
              required
              className="flex-[2] w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            >
              <option value="" disabled>Estado*</option>
              {states.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <input
              type="number"
              name="participant_limit"
              min="0"
              value={form.participant_limit === 0 ? '' : form.participant_limit}
              onChange={handleChange}
              placeholder="Participantes (0 = sin límite)"
              className="flex-1 w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
            <span className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">Costes</span>
            <div className="flex gap-4">
              <input
                type="number"
                name="currency_cost"
                min="0"
                value={form.currency_cost === 0 ? '' : form.currency_cost}
                onChange={handleChange}
                placeholder="Moneda (ej: 0)"
                className="flex-1 w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              />
              <input
                type="number"
                name="ticket_cost"
                min="0"
                value={form.ticket_cost === 0 ? '' : form.ticket_cost}
                onChange={handleChange}
                placeholder="Tickets (ej: 0)"
                className="flex-1 w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              />
              <input
                type="number"
                name="credit_cost"
                min="0"
                value={form.credit_cost === 0 ? '' : form.credit_cost}
                onChange={handleChange}
                placeholder="Créditos (ej: 0)"
                className="flex-1 w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1 flex flex-col">
              <label className="text-xs text-gray-600 dark:text-gray-300 mb-1">Fecha de inicio</label>
              <ReactDatePicker
                selected={form.start_date ? new Date(form.start_date) : null}
                onChange={date => handleChange({ target: { name: 'start_date', value: date } })}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="Pp"
                locale={es}
                placeholderText="Fecha de inicio"
                className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                isClearable
              />
            </div>
            <div className="flex-1 flex flex-col">
              <label className="text-xs text-gray-600 dark:text-gray-300 mb-1">Fecha de fin</label>
              <ReactDatePicker
                selected={form.end_date ? new Date(form.end_date) : null}
                onChange={date => handleChange({ target: { name: 'end_date', value: date } })}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="Pp"
                locale={es}
                placeholderText="Fecha de fin"
                className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                isClearable
              />
            </div>
          </div>
          {dateError && <div className="text-red-600 text-sm mb-2">{dateError}</div>}
          <div className="my-2">
            <QuizzesSelector selectedQuizzes={selectedQuizzes} setSelectedQuizzes={setSelectedQuizzes} />
          </div>
          <div className="flex gap-2 justify-end mt-4">
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{loading ? 'Guardando...' : 'Guardar'}</button>
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-600">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

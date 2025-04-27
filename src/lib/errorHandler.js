// src/lib/errorHandler.js
import toast from 'react-hot-toast'

export const handleError = (error, options = {}) => {
  
  const defaultMessage = 'Error en la operación'
  const message = error.response?.data?.error // <-- directamente el error (string)
    || error.response?.data?.message           // <-- si alguna API devuelve 'message'
    || error.message                           // <-- fallback a mensaje de axios
    || defaultMessage                          // <-- último recurso
  


  if (!options.silent) {
    toast.error(message, {
      duration: options.duration || 3500,
      position: "top-center",
      id: options.id || error.code // Para evitar duplicados
    })
  }
  
  return {
    message,
    code: error.response?.status || 500,
    isAuthError: error.response?.status === 401 || error.response?.status === 403,
    isValidationError: error.response?.status === 400
  }
}
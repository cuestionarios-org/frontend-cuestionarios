# 🧠 Cuestionarios - Frontend

Aplicación React para gestionar competencias y cuestionarios de conocimiento, con soporte multilenguaje y autenticación.

## 🚀 Tecnologías principales

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [i18next](https://www.i18next.com/) (internacionalización)
- [Axios](https://axios-http.com/)
- [react-hot-toast](https://react-hot-toast.com/) (notificaciones)

## ⚡ Instalación rápida

1. **Clona el repositorio:**
   ```sh
   git clone https://github.com/tu-usuario/frontend-cuestionarios.git
   cd frontend-cuestionarios
   ```

2. **Instala las dependencias:**
   ```sh
   npm install
   ```

3. **Configura las variables de entorno:**
   - Crea un archivo `.env` en la raíz con la URL de la API:
     ```
     VITE_API_URL=http://localhost:3000
     ```

4. **Inicia el servidor de desarrollo:**
   ```sh
   npm run dev
   ```
   El proyecto estará disponible en [http://localhost:5173](http://localhost:5173)

## 📝 Scripts útiles

- `npm run dev` — Levanta el entorno de desarrollo con recarga en caliente.
- `npm run build` — Genera la versión optimizada para producción.
- `npm run preview` — Previsualiza el build de producción.
- `npm run lint` — Ejecuta ESLint para revisar el código.

## 🌐 Internacionalización

El proyecto soporta Español, Inglés y Portugués. Puedes cambiar el idioma desde el menú superior.

## 🛠️ Estructura principal

- `src/components/` — Componentes reutilizables (Navbar, Loader, etc)
- `src/pages/` — Vistas principales (Landing, Competencias, etc)
- `src/context/` — Contextos globales (Auth, Tema)
- `src/services/` — Servicios para llamadas a API
- `src/locales/` — Archivos de traducción

## 📦 Requisitos

- Node.js >= 18
- npm >= 9

## 📄 Licencia

MIT

---

> Si tienes dudas o sugerencias, ¡no dudes en abrir un issue

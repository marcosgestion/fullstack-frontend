import { RouterProvider } from '@tanstack/react-router'
import { router } from '@/router'
import { Toaster } from 'sonner' // 1. Se importa el componente

function App() {
  return (
    <>
      <RouterProvider router={router} />
      
      {/* 2. Se inyecta al final. "richColors" hará que el fondo sea rojo para errores y verde para éxitos */}
      <Toaster richColors position="bottom-right" closeButton />
    </>
  )
}

export default App
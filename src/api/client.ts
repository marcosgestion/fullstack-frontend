import { API_URL } from '@/config/globals'
import { toast } from 'sonner'

export async function apiClient<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token')

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers })
    const body = await response.json()

    if (!response.ok || !body.success) {
      const errorMessage = body.message || 'Ocurrió un error inesperado'

      // Si el token es inválido o expiró (401), pero no si es un intento de login fallido
      if (response.status === 401 && endpoint !== '/auth/login') {
        toast.error('Sesión expirada o token inválido. Redirigiendo...')
        localStorage.removeItem('token')
        localStorage.removeItem('role')

        // Retardo de 1.5s para permitir la visibilidad del Toast antes de navegar
        setTimeout(() => {
          window.location.href = '/login'
        }, 1500)

        throw new Error(errorMessage)
      }

      // Para el resto de errores (403 Acceso Denegado, 400, 500, etc.)
      toast.error(errorMessage)
      throw new Error(errorMessage)
    }

    return (body.data !== undefined ? body.data : body) as T
  } catch (error) {
    if (error instanceof TypeError) {
      toast.error('Error de conexión con el servidor')
    }
    throw error
  }
}
import { apiClient } from './client'

// ------------------------------------------------------------
// POST /auth/login → realiza la autenticación de usuario
// Delegamos el envío de datos, parsing JSON y notificación de errores a apiClient.
// ------------------------------------------------------------
export async function login(email: string, password: string) {
  return await apiClient('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}
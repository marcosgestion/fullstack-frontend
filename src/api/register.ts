import { apiClient } from './client'

export interface RegisterPayload {
  nombre: string
  apellido: string
  email: string
  password: string
}

// ------------------------------------------------------------
// POST /auth/register → registra un nuevo usuario
// Delegamos el envío del payload, parsing y manejo de errores a apiClient.
// ------------------------------------------------------------
export async function register(payload: RegisterPayload) {
  return await apiClient('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      ...payload,
      role: 'GUEST',
      fechaNacimiento: '2000-01-01',
      edad: 25,
      genero: 'No especificado',
      telefono: '000000',
      direccion: 'Sin dirección',
      localidad: 'Sin localidad',
      provincia: 'Sin provincia',
      pais: 'Argentina',
      codigoPostal: '0000',
    }),
  })
}
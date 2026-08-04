import { apiClient } from './client'

// ------------------------------------------------------------
// POST /users → crea un usuario desde la vista de administración
// Delegamos el envío de credenciales, payload y manejo de errores a apiClient.
// ------------------------------------------------------------
export async function createUser(
  nombre: string,
  apellido: string,
  email: string,
  password: string,
  role: string = 'USER'
) {
  return await apiClient('/users', {
    method: 'POST',
    body: JSON.stringify({
      nombre,
      apellido,
      email,
      password,
      role,
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
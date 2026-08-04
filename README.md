# LP Gestión - Web Application (Frontend)

Aplicación web cliente para la plataforma **LP Gestión**, desarrollada con React 19, TypeScript y Vite. Diseñada bajo una arquitectura modular por componentes y páginas, la interfaz se conecta de manera stateless a la API REST server para gestionar la visualización, filtrado, edición y auditoría de usuarios según su jerarquía de roles (RBAC).

---

## 🏗️ Arquitectura del Proyecto

El proyecto sigue una convención estricta de carpetas por módulo y componente. Cada vista o componente cuenta con su propio archivo de estructura (`.tsx`) y su módulo de estilos locales (`.module.css`), evitando colisiones de estilos globales.

```text
src/
├── api/            # Capa de integración HTTP personalizada (apiClient, endpoints y tipos)
├── assets/         # Archivos multimedia (Imágenes de la marca, logos, videos)
├── components/     # Componentes reutilizables
│   ├── blocks/     # Composiciones complejas (Modal de confirmación, Navegación)
│   └── ui/         # Elementos atómicos de UI (Button, Icons centralizados)
├── config/         # Constantes globales (API_URL)
├── pages/          # Vistas principales de la aplicación
│   ├── CreateUser/ # Vista de creación de usuarios
│   ├── Home/       # Dashboard principal (Directorio, búsqueda, modales de vista/edición)
│   ├── Login/      # Pantalla de autenticación con fondo de video
│   └── Register/   # Pantalla de auto-registro (Asignación automática de rol GUEST)
├── styles/         # Estilos globales y variables de diseño (Tema Oscuro/Claro)
├── App.tsx         # Componente raíz con RouterProvider e inyección de Notificaciones Toast
├── main.tsx        # Punto de entrada de la aplicación en el DOM
└── router.tsx      # Definición de rutas fuertemente tipadas con TanStack Router
```

---

## 🛠️ Stack Tecnológico Principal

| Tecnología | Propósito en el Proyecto |
| :--- | :--- |
| **React 19** | Librería principal para la construcción de interfaces de usuario reactivas. |
| **Vite** | Bundler y servidor de desarrollo ultra-rápido basado en ESM. |
| **TypeScript** | Tipado estático estricto para garantizar la integridad de datos de la API. |
| **TanStack Router** | Enrutador declarativo con tipado completo y navegación sin recargas. |
| **CSS Modules** | Estilos con alcance local por componente (*scoped CSS*) para evitar colisiones. |
| **Sonner** | Sistema centralizado de notificaciones interactivas (*Toasts*) ricas en color. |

---

## 🛡️ Características Avanzadas del Frontend

### 1. Cliente HTTP Centralizado (`apiClient`)
Toda comunicación con la API REST se canaliza a través del helper `apiClient` (`src/api/client.ts`):
* **Inyección de Token:** Inyecta automáticamente el encabezado `Authorization: Bearer <token>` recuperado de `localStorage`.
* **Gestión Unificada de Errores:** Captura errores HTTP y muestra alertas visuales con `sonner`.
* **Manejo de Expiración (401):** Si el token expira o es inválido, muestra un toast de advertencia y redirige automáticamente al usuario a `/login` tras un retardo de 1.5 segundos para garantizar la lectura de la alerta.

### 2. Flujo de Auditoría en Eliminación de Usuarios
Al eliminar un registro desde la tabla principal (`Home.tsx`), la aplicación solicita obligatoriamente el **motivo de la eliminación** mediante un recuadro de texto. Este motivo se envía en el body de la petición `DELETE /users/:id`, permitiendo al Backend registrar el evento completo en la colección de auditoría `SecurityLog`.

### 3. Adaptación Dinámica por Roles (RBAC UI)
La interfaz adapta sus elementos visibles según el rol del usuario autenticado:
* **Insignias Visuales (Badges):** Identificación por colores para los roles `ROOT`, `ADMIN`, `USER` y `GUEST`.
* **Control de Acciones:** Los botones de creación (`+ Agregar Usuario`) y eliminación de registros se habilitan exclusivamente para jerarquías operativas `ROOT` y `ADMIN`.
* **Filtro y Búsqueda en Tiempo Real:** Filtro cliente por nombre, apellido, email o rol sin necesidad de peticiones adicionales al servidor.

---

## ⚙️ Configuración del Entorno

La URL del backend se configura globalmente en `src/config/globals.ts`:

```typescript
// URL del servidor API REST (Express)
export const API_URL = 'http://localhost:3080'
```

---

## 🚀 Instalación y Ejecución

1. **Clonar y preparar el repositorio:**
   ```bash
   git clone [https://github.com/marcosgestion/fullstack-frontend.git](https://github.com/marcosgestion/fullstack-frontend.git)
   cd fullstack-frontend
   npm install
   ```

2. **Iniciar Servidor de Desarrollo:**
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:5173`.

3. **Generar Build de Producción:**
   ```bash
   npm run build
   ```

4. **Previsualizar Build de Producción:**
   ```bash
   npm run preview
   ```

---

## 📍 Mapa de Navegación y Rutas

| Ruta | Vista | Acceso / Permisos | Descripción |
| :--- | :--- | :--- | :--- |
| `/` | `Home` | Requiere Token | Directorio principal de usuarios con modal de detalle y edición. |
| `/login` | `Login` | Público | Autenticación con credenciales y almacenamiento de JWT en `localStorage`. |
| `/register` | `Register` | Público | Formulario de registro para nuevos usuarios con asignación por defecto rol GUEST. |
| `/create-user` | `CreateUser` | Requiere Token (ROOT/ADMIN) | Formulario para el alta de nuevos usuarios desde el panel de control. |
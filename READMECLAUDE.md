# LP Gestión - Notas de Desarrollo (Frontend)

Documento que resume las decisiones, patrones y consideraciones de diseño que tomé durante el desarrollo del frontend de LP Gestión. Pensé en escribir esto para dejar claro el "por qué" detrás de cada cosa, no solo el "qué".

---

## 🎯 Punto de Partida

Necesitaba construir una interfaz web para gestionar usuarios en un sistema con diferentes niveles de acceso (roles jerárquicos). La idea era que fuera escalable desde el inicio: si en el futuro agregamos más vistas o funcionalidades, el código no se convierta en un desastre.

La decisión de usar **React** fue natural porque ya le tenía experiencia, pero me aseguré de mantener el proyecto limpio usando **TypeScript** desde el principio. Eso me ahorró muchos dolores de cabeza cuando refactoricé cosas.

---

## 📁 Cómo Organicé el Código

Dividí todo en carpetas claras porque prefiero encontrar cosas rápido:

```
src/
├── api/           # Todo lo que habla con el servidor
├── components/    # Piezas de UI reutilizables
├── pages/         # Las vistas principales (Login, Home, etc)
├── config/        # Configuraciones globales (URL del backend)
├── types/         # Tipos compartidos entre componentes
├── styles/        # CSS global y variables de tema
└── store/         # Gestión de estado (si la necesito)
```

Dentro de `components/`, separé las cosas en dos niveles:
- **ui/**: Componentes muy básicos (botones, iconos, inputs). Son los bloques de construcción.
- **blocks/**: Cosas más complejas que combinan varios componentes básicos (modales, barras de navegación).

Cada página en `pages/` tiene su propia carpeta con su archivo `.tsx` y su `.module.css`. Esto significa que si el Home es roto, no afecta a Login. Los estilos nunca se pisan porque cada uno es local.

---

## 🔗 Cómo Hablo con el Backend

Toda comunicación pasa por un cliente HTTP centralizado en `src/api/client.ts`. Fue una decisión importante porque:

**Antes (sin cliente centralizado):** Si cambio la URL del backend, tendría que buscar y cambiar en 20 archivos distintos. Pesadilla.

**Ahora:** Un solo lugar donde arreglar cosas. Además, ese cliente se encarga de:
- Inyectar el token de autenticación automáticamente desde el `localStorage`
- Mostrar mensajes de error visuales (toasts) para que el usuario sepa qué pasó
- Manejar cuando el token expira (redirige a login después de 1.5 segundos)

Lo interesante fue descubrir que si simplemente capturaba cualquier error 401 como "sesión expirada", me mostraba ese mensaje incluso cuando el usuario escribía mal la contraseña en el login. Eso fue confuso. Así que agregué lógica para distinguir: si es un 401 en `/auth/login`, es porque las credenciales están mal. Si es un 401 en cualquier otro lugar, entonces sí es la sesión que expiró.

---

## 🛡️ Sistema de Roles (RBAC)

La aplicación necesita saber qué puede ver y hacer cada usuario según su rol. No enseño un botón de "Eliminar Usuario" si la persona es un GUEST, porque no debería poder hacerlo.

Implementé esto con insignias de colores en la interfaz (un ADMIN tiene una insignia azul, un ROOT es roja, etc). Visuales. Más fácil de entender que leer un número.

El control real de acceso vive en el backend (nunca confío solo en el frontend para seguridad), pero la UI se adapta para no mostrar opciones que el usuario no puede usar de todas formas.

---

## 🗑️ El Flujo de Eliminar Usuarios

Cuando alguien intenta borrar un usuario, la aplicación exige que escriba **por qué** lo está eliminando. Eso se manda al backend junto con la petición de eliminación.

¿Por qué? Porque si más adelante un auditor pregunta "¿quién borró al usuario X?", puedo saber exactamente quién fue y por qué. Es un requisito común en sistemas que manejan información sensible.

---

## 🎨 Tema Oscuro/Claro

Inicialmente pensé en hacer que el usuario elija el tema manualmente. Pero decidí usar la preferencia del sistema operativo en su lugar. Si alguien usa todo en oscuro, que la app sea oscura por defecto. Menos clicks, mejor experiencia.

Los colores y variables están centralizadas en `src/styles/` para que cambiar la paleta sea cosa de segundos.

---

## ⚡ Decisiones Técnicas Clave

### Por qué TypeScript

React por sí solo te deja escribir cualquier cosa. Con TypeScript, si intento pasar el tipo incorrecto a una función, me lo dice antes de que lo compile. Eso es oro puro cuando trabajas solo.

### Por qué TanStack Router

Es el router de facto para React estos días. Me gustó porque:
- Los tipos se revisan en tiempo de compilación (si cambio una ruta, tengo que actualizar donde la uso)
- No hay recargas de página, todo es fluido
- Puedo proteger rutas que requieren autenticación sin escribir mucha lógica

### Por qué Sonner para notificaciones

Probé otras librerías, pero Sonner es simple, se ve bien y tiene soporte para colores ricos (errores rojos, éxitos verdes, etc). No necesitaba nada más complejo.

### Por qué CSS Modules en lugar de Tailwind

Es verdad que Tailwind es popular, pero CSS Modules me da más control y los estilos no se pisan nunca. Cada componente tiene su propio CSS, punto.

### Por qué no hay una barra de navegación global

Al principio armé un componente `Navigation` genérico, con links fijos a Home, Login y Crear Usuario, pensando en usarlo como header compartido en toda la app. Nunca llegué a conectarlo a ninguna página y terminó quedando ahí sin uso.

Cuando lo revisé de nuevo, me di cuenta de que ese enfoque no encajaba con cómo terminó funcionando el resto de la app:

- Login y Register son pantallas públicas. Una barra con un link a "Crear Usuario" ahí no tiene sentido, porque sin sesión esa ruta rebota directo a `/login`.
- `/create-user` es solo para roles ROOT y ADMIN. Un componente de navegación genérico no sabe nada de roles, así que le mostraría ese link a cualquiera, incluido un GUEST que no puede usarlo.
- Home ya tiene su propio header, con logo, botones y lógica de permisos (`isManager`). Meter una barra de navegación genérica arriba hubiera significado dos navegaciones compitiendo en la misma pantalla.

En vez de forzar ese componente para que encajara, decidí borrarlo y dejar que cada página resuelva su propia navegación según su contexto (un link "Registrate acá" en Login, "Volver a la lista" en CreateUser, botones con lógica de roles en Home). Es menos "reutilizable" en el papel, pero es más honesto con lo que la app realmente necesita en cada pantalla. Si en algún momento la app crece y varias pantallas autenticadas repiten la misma navegación, ahí sí tendría sentido armar un layout compartido, pero pensado desde el principio para manejar sesión y roles — no reciclar esta versión genérica.

---

## 🐛 Problemas que Encontré y Resolví

**Problema 1:** Los estilos de un componente se filtraban a otros.  
**Solución:** CSS Modules. Cada archivo CSS es como una burbuja de estilo propia.

**Problema 2:** No sabía dónde estaban mis tipos. Algunos vivían en archivos `.ts` sueltos, otros en comentarios.  
**Solución:** Creé una carpeta `types/` centralizada. Todo tipo que se use en múltiples componentes vive ahí.

**Problema 3:** El token se perdía si recargaba la página.  
**Solución:** Lo guardo en `localStorage` cuando me logueo, y lo recupero de ahí cuando la app inicia.

**Problema 4:** Los mensajes de error del login eran demasiado genéricos.  
**Solución:** El cliente HTTP ahora es más inteligente y distingue entre diferentes tipos de error 401.

---

## 🚀 Cómo Usar la App Localmente

```bash
# 1. Instalar dependencias
npm install

# 2. Correr en modo desarrollo
npm run dev
# Abre http://localhost:5173

# 3. Generar el build para producción
npm run build

# 4. Previsualizar cómo se ve el build
npm run preview
```

Lo único que necesitas es que el backend esté corriendo en `http://localhost:3080` (o ajustas la URL en `src/config/globals.ts`).

---

## 📍 Las Vistas Principales

| Ruta | Qué Es | Quién Puede Entrar |
|------|--------|-------------------|
| `/login` | Pantalla para autenticarse | Cualquiera sin sesión |
| `/register` | Formulario para registrarse | Cualquiera sin sesión |
| `/` (Home) | Directorio de usuarios, búsqueda, ver/editar detalles | Alguien con sesión válida |
| `/create-user` | Formulario para agregar nuevos usuarios | Administradores (ROOT/ADMIN) |

---

## 🔐 Notas sobre Seguridad

El frontend maneja el token como mejor puede, pero la seguridad real vive en el backend. Nunca confío en lo que hace el cliente. Si alguien manipula el `localStorage` desde la consola, puede guardar un token falso, pero el servidor lo rechazará de todas formas.

Las acciones destructivas (eliminar, editar) se validan siempre en el servidor, no solo en la UI.

---

## 📚 Qué Me Gustaría Mejorar

Si volviera a empezar:
- Agregar un sistema de notificaciones más elaborado (alertas que persisten, historial)
- Tener tests automatizados (unit tests, tests de integración)
- Implementar un estado global más robusto si la app crece mucho
- Lazy loading de componentes para que el bundle inicial sea más pequeño

---

## 💭 Reflexión Final

El desarrollo del frontend fue bastante directo una vez que decidí la estructura. La parte difícil no fue React ni TypeScript, sino pensar en cómo organizar todo para que en 6 meses cuando vuelva al código, pueda entender rápidamente por qué hice las cosas así.

Siempre preferí escribir menos código pero que fuera claro, antes de escribir mucho código inteligente que después nadie entiende (incluyéndome a mí).

# LuxeStay - Sistema de Gestión Hotelera (Frontend)

## ¿Qué es esto?

LuxeStay es el frontend de una plataforma para gestionar un hotel: los clientes pueden ver las habitaciones disponibles, revisar detalles, reservar y pagar, todo desde una interfaz pensada para que se vea moderna y sea fácil de usar.

Está hecho con **React + Vite** y se conecta (en teoría, por ahora) a un backend en **Spring Boot** a través de una API REST.

---

## Tecnologías usadas

- React 18
- Vite
- React Router DOM v6 (para las rutas/navegación)
- Axios (para las peticiones al backend, configurado en `hotelApi.js`)
- Bootstrap + CSS propio (`styles.css`)
- SweetAlert2 (para las alertas bonitas, como confirmaciones de pago)

### Lo que falta integrar

- React Hook Form
- Context API o Redux Toolkit (todavía no manejamos estado global)
- Zod o Yup para validaciones

---

## Estructura del proyecto

```
src/
 ├── pages/
 │    ├── DetallesDeHabitacion.jsx
 │    ├── Habitaciones.jsx
 │    ├── Home.jsx
 │    ├── Login.jsx
 │    ├── MisReservas.jsx
 │    ├── Nosotros.jsx
 │    ├── Pagos.jsx
 │    └── Reservas.jsx
 ├── services/
 │    └── hotelApi.js
 ├── App.jsx
 ├── main.jsx
 └── styles.css
```

---

## Portal de clientes

La idea principal del proyecto es que un cliente pueda hacer todo este recorrido: ver habitaciones → revisar el detalle → reservar → pagar → consultar sus reservas.

### Home (`/`)

Es la página de bienvenida. Tiene una sección hero con imagen de fondo, una parte de "Experiencia Digital" con tres tarjetas informativas, algunas habitaciones destacadas y un footer con newsletter y enlaces de navegación.

### Habitaciones (`/habitaciones`)

Aquí se muestra el catálogo completo (9 habitaciones). Tiene filtros que funcionan en tiempo real:

- Rango de precio (slider de $100 a $1000)
- Tipo de habitación (Suite, Deluxe, Business)
- Botón para limpiar todos los filtros

También hay un cartel de descuento del 15% para miembros y un contador de resultados que se actualiza según los filtros aplicados.

### Detalle de habitación (modal)

Se abre como un modal encima de `/habitaciones`. Muestra la imagen, el tipo de habitación, la descripción, las características en forma de pills y el precio por noche. Desde aquí el botón "Reservar" lleva a `/reservar` con la info de la habitación seleccionada.

### Reservar (`/reservar`)

Formulario dividido en dos partes:

1. Fechas de check-in y check-out (con validación de mínimos)
2. Datos del huésped: nombre, email, teléfono, número de personas y peticiones especiales

A un lado se muestra un resumen de la habitación elegida. Al confirmar, pasa a `/pago` con todos los datos juntos.

### Pago (`/pago`)

Se puede elegir entre tarjeta de crédito/débito o PayPal. El formulario de tarjeta tiene formateo automático (el número se agrupa de 4 en 4, la expiración queda en MM/YY, etc.). Al confirmar, se simula el pago con SweetAlert2 (loading → éxito) y redirige a `/mis-reservas`. También hay un resumen con la habitación, las fechas y el total a pagar.

### Login (`/login`)

Aparece como modal sobre la página actual. Tiene campos de email y contraseña con opción de mostrar/ocultar la contraseña. Está listo a nivel de interfaz, pero todavía no hace la llamada real al backend. Incluye links a "registro" y "recuperar contraseña".

### Mis Reservas (`/mis-reservas`)

Muestra el listado de reservas del usuario en formato accordion (se pueden expandir o colapsar). Cada reserva muestra el nombre, correo, teléfono y peticiones especiales del huésped, además de su estado (Confirmada o Pendiente).

### Nosotros (`/nosotros`)

Página informativa con un hero y una sección de "Qué hacemos" con tres puntos principales sobre el proyecto.

---

## Rutas

```
/                  → Home
/nosotros          → Nosotros
/habitaciones      → Catálogo de habitaciones
/reservar          → Formulario de reserva
/pago              → Formulario de pago
/login             → Modal de inicio de sesión
/mis-reservas      → Reservas del usuario
*                  → Redirige a Home (fallback)
```

---

## Componentes principales

- **Header**: navbar fija, está exportado desde `Home.jsx` y se reutiliza en todas las páginas
- **Icon**: componente SVG reutilizable para íconos (ubicación, calendario, usuario, búsqueda, enviar)
- **DetallesDeHabitacion**: el modal con el detalle de cada habitación
- **RoomCard**: tarjeta de habitación usada en Home
- **Footer**: está dentro de `Home.jsx`

---

## Diseño

- Colores: azul oscuro `#041120`, dorado `#8A6416`, amarillo `#F59A13`, fondo claro `#F5F7FC`
- Tipografía: Inter
- Es responsive, con breakpoints en 980px y 680px
- La inspiración visual es algo tipo Booking/Airbnb pero más premium
- Las transiciones en hover son suaves (180ms)

---

## Cómo se mueven los datos entre páginas

Por ahora no usamos estado global, así que la información se va pasando entre páginas usando `location.state` de React Router:

```
Habitaciones
    └── selectedRoom (useState)
         └── DetallesDeHabitacion (modal)
              └── Link state={{ room }} → /reservar
                   └── navigate('/pago', { state: { room, reservation } })
                        └── Pagos → navigate('/mis-reservas')
```

---

## Conexión con el backend

Ya tenemos la instancia de Axios configurada en `src/services/hotelApi.js`:

```js
const hotelApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 8000,
});
```

Los endpoints que se van a usar son:

```
/api/auth
/api/habitaciones
/api/reservas
/api/pagos
/api/clientes
```

Por ahora `hotelApi.js` está listo pero ningún componente lo está usando todavía, falta conectar todo con el backend real.

---

## Estado actual

Lo que ya está hecho:

- Arquitectura y tecnologías definidas
- Todas las rutas implementadas
- Todas las páginas del portal de clientes creadas
- El flujo completo (explorar → reservar → pagar) funciona de forma simulada
- Diseño responsive

Lo que falta:

- No hay estado global (Context o Redux)
- No hay autenticación real (el Login está listo visualmente pero sin conexión)
- Los datos de "Mis Reservas" están hardcodeados
- La paginación de Habitaciones todavía no tiene lógica real

---

## Próximos pasos

1. Conectar `Login.jsx` con el backend
2. Usar `hotelApi.js` en los componentes que lo necesiten
3. Reemplazar los datos hardcodeados de `MisReservas.jsx`
4. Implementar el formulario de PayPal en `Pagos.jsx`
5. Pasar las fechas y huéspedes reales al resumen de `Pagos.jsx`
6. Agregar validación de fechas (que checkout sea después de checkin) en `Reservas.jsx`
7. Implementar la paginación real en `Habitaciones.jsx`
8. Agregar rutas protegidas con autenticación
9. Implementar Context API o Redux para manejar el usuario y el token JWT

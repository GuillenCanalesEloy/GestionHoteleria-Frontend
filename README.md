# 📄 FRONTEND - LuxeStay Sistema de Gestión Hotelera

## 📌 Descripción general

LuxeStay es una plataforma de gestión hotelera premium construida con **React + Vite**.
Permite a los usuarios explorar habitaciones, realizar reservas y gestionar sus estadías desde una interfaz moderna y responsiva.

Consume un backend en **Spring Boot** mediante **API REST**.

---

# 🧩 Tecnologías del Frontend

## Base principal

* React 18
* Vite

## Librerías y herramientas

* React Router DOM v6 (navegación)
* Axios (consumo de API — instancia en `hotelApi.js`)
* CSS personalizado `styles.css` + Bootstrap (estilos)
* SweetAlert2 (alertas y confirmaciones)

## Pendientes / Por integrar

* React Hook Form (formularios)
* Context API o Redux Toolkit (estado global — aún no implementado)
* Zod o Yup (validaciones)

---

# 🔹 Estructura del Proyecto

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

# 🔹 1. PORTAL DE CLIENTES

## 🎯 Objetivo

Permitir a los clientes:

* Explorar habitaciones disponibles
* Ver el detalle de cada habitación
* Realizar una reserva
* Completar el pago
* Consultar sus reservas activas

---

## 📄 Páginas principales

### 🏠 Home (`/`)

* Presentación del hotel (hero con imagen de fondo)
* Sección "Experiencia Digital" con 3 cards informativas
* Habitaciones destacadas (2 cards con imagen y precio)
* Strip de estadísticas (15+ destinos, 500+ habitaciones, etc.)
* Footer con newsletter, navegación y legales

### 🛏️ Habitaciones (`/habitaciones`)

* Catálogo completo con 9 habitaciones
* Filtros reactivos:
  * Rango de precio (slider $100 – $1000)
  * Tipo de habitación (Suite, Deluxe, Business)
  * Botón "Limpiar Filtros"
* Panel de descuento para miembros (15% OFF)
* Grid de resultados con conteo dinámico

### 🔍 Detalle de Habitación (modal)

* Se abre como modal sobre `/habitaciones`
* Imagen + tag de tipo
* Título, descripción, features como pills
* Precio por noche
* Botón "Reservar" → navega a `/reservar` con datos de la habitación

### 📅 Reservar (`/reservar`)

* Formulario de 2 secciones:
  * Fechas de estancia (check-in / check-out con validación de mínimos)
  * Información del huésped (nombre, email, teléfono, número de personas, peticiones especiales)
* Aside con resumen de la habitación seleccionada
* Al confirmar navega a `/pago` con todos los datos

### 💳 Pago (`/pago`)

* Toggle entre Tarjeta de crédito/débito y PayPal
* Formateo automático: número de tarjeta (grupos de 4), expiración (MM/YY), CVV
* Simulación de pago con SweetAlert2: loading → éxito → redirige a `/mis-reservas`
* Aside con resumen de habitación, fechas y total

### 👤 Login (`/login`)

* Modal sobre la página actual (modal pattern con `backgroundLocation`)
* Campos: email y contraseña con toggle de visibilidad
* Preparado para backend (sin llamada real aún)
* Links a `/registro` y `/recuperar-contrasena`

### 📖 Mis Reservas (`/mis-reservas`)

* Listado de reservas del usuario
* Accordion: expandir/colapsar detalle de cada reserva
* Detalle: nombre, correo, teléfono y peticiones especiales del huésped
* Estados: Confirmada, Pendiente

### ℹ️ Nosotros (`/nosotros`)

* Hero con descripción del proyecto
* Sección "Qué hacemos" con 3 pilares informativos

---

## 🧭 Rutas

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

## 🧱 Componentes principales

* `Header` — navbar sticky, exportado desde `Home.jsx`, reutilizado en todas las páginas
* `Icon` — componente SVG reutilizable (location, calendar, user, search, send)
* `DetallesDeHabitacion` — modal de detalle de habitación
* `RoomCard` — card de habitación en Home
* `Footer` — incluido dentro de `Home.jsx`

---

## 🎨 Diseño UX/UI

* Paleta: azul oscuro `#041120`, dorado `#8A6416`, amarillo `#F59A13`, fondo claro `#F5F7FC`
* Tipografía: Inter (ui-sans-serif como fallback)
* Responsive: breakpoints en 980px y 680px
* Estilo tipo Booking / Airbnb premium
* Transiciones suaves en hover (180ms ease)

---

# 🔹 Flujo de Datos entre Páginas

No hay estado global implementado aún. Los datos viajan con `location.state` de React Router:

```
Habitaciones
    └── selectedRoom (useState)
         └── DetallesDeHabitacion (modal)
              └── Link state={{ room }} → /reservar
                   └── navigate('/pago', { state: { room, reservation } })
                        └── Pagos → navigate('/mis-reservas')
```

---

# 🔹 Comunicación con Backend

Instancia Axios configurada en `src/services/hotelApi.js`:

```js
const hotelApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 8000,
});
```

Endpoints previstos:

```
/api/auth
/api/habitaciones
/api/reservas
/api/pagos
/api/clientes
```

> ⚠️ El backend aún no está conectado. `hotelApi.js` está listo pero ningún componente lo consume todavía.

---

# 🔹 Estado actual del Frontend

✔ Arquitectura definida  
✔ Tecnologías seleccionadas  
✔ Rutas implementadas  
✔ Todas las páginas del portal cliente creadas  
✔ Flujo completo: explorar → reservar → pagar  
✔ Diseño responsive implementado  
⚠️ Sin estado global (Context / Redux)  
⚠️ Sin autenticación real (Login preparado pero sin backend)  
⚠️ Datos de MisReservas hardcodeados  
⚠️ Paginación en Habitaciones sin lógica real  

---

# 🔹 Pendientes / TODO

* Conectar `Login.jsx` con backend real
* Integrar `hotelApi.js` en todos los componentes
* Reemplazar datos hardcodeados en `MisReservas.jsx`
* Implementar formulario PayPal en `Pagos.jsx`
* Pasar fechas y huéspedes reales al aside de `Pagos.jsx`
* Agregar validación de fechas (checkout > checkin) en `Reservas.jsx`
* Implementar lógica de paginación en `Habitaciones.jsx`
* Implementar rutas protegidas con autenticación
* Agregar Context API o Redux para usuario autenticado y token JWT

---

# 🚀 Siguiente paso

* Conectar `hotelApi.js` con los endpoints del backend
* Implementar autenticación JWT con Context API
* Reemplazar datos estáticos con llamadas reales a la API
* Desarrollar Panel Administrativo (segunda fase)

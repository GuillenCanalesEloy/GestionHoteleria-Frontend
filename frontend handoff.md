# 📄 FRONTEND - Sistema de Gestión Hotelera

## 📌 Descripción general

El frontend del sistema de gestión hotelera estará dividido en **dos módulos principales**:

1. **Portal de Clientes (Frontend Público)**
2. **Panel Administrativo (Frontend Privado)**

Ambos consumirán un backend en Spring Boot mediante API REST.

---

# 🧩 Tecnologías del Frontend

## Base principal

* React
* Vite

## Librerías y herramientas

* React Router DOM (navegación)
* Axios (consumo de API)
* Tailwind CSS o Bootstrap (estilos)
* React Hook Form (formularios)
* SweetAlert2 (alertas)
* Context API o Redux Toolkit (estado global)

## Opcionales (para mejorar)

* Material UI o Ant Design (UI profesional)
* Chart.js o Recharts (gráficos)
* Zod o Yup (validaciones)

---

# 🔹 1. PORTAL DE CLIENTES (Frontend Público)

## 🎯 Objetivo

Permitir a los clientes:

* Buscar habitaciones
* Ver disponibilidad
* Reservar
* Pagar
* Consultar sus reservas

---

## 📄 Páginas principales

### 🏠 Home

* Presentación del hotel
* Ofertas
* Buscador rápido

### 🛏️ Habitaciones

* Lista de habitaciones
* Filtros (precio, tipo, disponibilidad)

### 🔍 Detalle de habitación

* Imágenes
* Descripción
* Precio
* Botón de reserva

### 📅 Reservar

* Selección de fechas
* Número de personas
* Confirmación

### 💳 Pago

* Resumen de reserva
* Método de pago

### 👤 Login / Registro

* Inicio de sesión
* Registro de cliente

### 📖 Mis reservas

* Historial
* Estado (confirmada, cancelada)

---

## 🧭 Rutas

* `/`
* `/habitaciones`
* `/habitaciones/:id`
* `/reservar`
* `/pago`
* `/login`
* `/registro`
* `/mis-reservas`

---

## 📁 Estructura

```
client-app/
 ├── components/
 ├── pages/
 ├── services/
 ├── routes/
 ├── context/
 ├── assets/
 ├── utils/
 └── App.jsx
```

---

## 🧱 Componentes principales

* Navbar
* Footer
* Card de habitación
* Buscador
* Formulario de reserva
* Modal de confirmación
* Loader
* Alertas

---

## 🎨 Diseño UX/UI

* Diseño moderno tipo Booking
* Responsive (móvil y desktop)
* Interfaz simple
* Enfoque en rapidez de reserva

---

# 🔹 2. PANEL ADMINISTRATIVO (Frontend Privado)

## 🎯 Objetivo

Permitir a los trabajadores gestionar el hotel.

Usuarios:

* Administrador
* Recepcionista
* Gerente

---

## 📄 Páginas principales

### 📊 Dashboard

* Estadísticas:

  * ingresos
  * reservas
  * ocupación

### 🛏️ Habitaciones

* CRUD completo
* Estados:

  * disponible
  * ocupada
  * mantenimiento

### 👥 Clientes

* Registro
* Edición
* Historial

### 📅 Reservas

* Crear
* Editar
* Cancelar
* Check-in / Check-out

### 💰 Pagos

* Registrar pagos
* Historial

### 👨‍💼 Empleados

* Gestión de usuarios
* Roles

### 📈 Reportes

* Ingresos
* Ocupación
* Clientes frecuentes

---

## 🧭 Rutas

* `/dashboard`
* `/habitaciones`
* `/clientes`
* `/reservas`
* `/pagos`
* `/empleados`
* `/reportes`

---

## 📁 Estructura

```
admin-app/
 ├── components/
 ├── pages/
 ├── services/
 ├── store/
 ├── routes/
 ├── layouts/
 ├── hooks/
 └── App.jsx
```

---

## 🧱 Componentes principales

* Sidebar
* Navbar admin
* Tabla reutilizable
* Formularios CRUD
* Modales
* Cards KPI
* Gráficos
* Alertas
* Loader

---

## 🔐 Seguridad

* Login con JWT
* Protección de rutas
* Control por roles:

  * ADMIN
  * RECEPCIONISTA
  * GERENTE

---

# 🔹 Estado Global

## Manejar con:

* Context API o Redux Toolkit

## Datos importantes:

* Usuario autenticado
* Token JWT
* Roles
* Reservas
* Habitaciones
* Configuración

---

# 🔹 Comunicación con Backend

Se consumirá API REST:

```
/api/auth
/api/habitaciones
/api/clientes
/api/reservas
/api/pagos
/api/reportes
```

---

# 🔹 Flujo del sistema

1. Cliente entra al portal
2. Busca habitación
3. Reserva
4. Paga
5. Backend registra
6. Admin gestiona desde panel

---

# 🔹 Estrategia de desarrollo

## Paso 1 (Cliente)

* Home
* Habitaciones
* Reserva

## Paso 2 (Admin)

* Dashboard
* CRUD básico

## Paso 3

* Integración con backend

---

# 🔹 Buenas prácticas

* Componentes reutilizables
* Separar lógica y UI
* Validar formularios
* Manejar errores
* Código modular
* Uso de servicios para API

---

# 🔹 Resultado esperado

Un sistema frontend dividido en:

### Cliente:

* Experiencia tipo Airbnb / Booking

### Admin:

* Sistema de gestión completo tipo ERP

---

# 🔹 Recomendación final

Puedes trabajar de dos formas:

## Opción 1 (Simple)

Un solo proyecto React con:

```
src/
 ├── client/
 ├── admin/
 ├── shared/
```

## Opción 2 (Profesional)

Dos proyectos separados:

* client-app
* admin-app

---

# ✅ Estado actual del frontend

✔ Arquitectura definida
✔ Tecnologías seleccionadas
✔ Módulos definidos
✔ Rutas establecidas
✔ Estructura organizada

---

# 🚀 Siguiente paso

* Crear proyecto React con Vite
* Empezar con portal cliente
* Luego panel admin
* Finalmente conectar con backend

---
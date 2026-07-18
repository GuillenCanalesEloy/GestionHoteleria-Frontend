# LuxeStay - Gestion Hotelera Frontend

Frontend web para un sistema de gestion hotelera. La aplicacion permite que los clientes exploren habitaciones y areas comunes, realicen reservas, simulen pagos y consulten sus reservas. Tambien incluye vistas administrativas para gestionar habitaciones, areas comunes, clientes, reservas, pagos, reportes y dashboard.

## Tecnologias

- React 19
- Vite 7
- React Router DOM 7
- Axios
- Bootstrap 5
- React Hook Form
- SweetAlert2
- CSS propio en `src/styles.css`

## Requisitos

- Node.js 20 o superior recomendado
- npm 10 o superior
- Backend del sistema hotelero disponible si se desea probar la integracion real con API

## Instalacion

Clona el repositorio e instala las dependencias:

```bash
npm install
```

## Configuracion

La URL base del backend se configura con la variable de entorno `VITE_API_URL`.

Crea un archivo `.env.local` en la raiz del proyecto si necesitas apuntar a un backend local o remoto:

```bash
VITE_API_URL=http://localhost:8080/api
```

Si no defines esta variable, el frontend usara `/api` como ruta base.

## Ejecucion en desarrollo

Levanta el servidor de desarrollo de Vite:

```bash
npm run dev
```

Luego abre la URL que indique la terminal, normalmente:

```text
http://localhost:5173
```

## Compilar para produccion

Genera la version optimizada:

```bash
npm run build
```

La salida se crea en la carpeta `dist/`.

## Previsualizar la build

Para revisar localmente la version generada:

```bash
npm run preview
```

## Scripts disponibles

| Comando | Descripcion |
| --- | --- |
| `npm run dev` | Inicia el servidor local de desarrollo. |
| `npm run build` | Compila la aplicacion para produccion. |
| `npm run preview` | Sirve localmente la build generada en `dist/`. |

## Rutas principales

### Cliente

| Ruta | Descripcion |
| --- | --- |
| `/` | Pagina de inicio. |
| `/login` | Inicio de sesion. |
| `/registro` | Registro de usuario. |
| `/nosotros` | Informacion del proyecto/hotel. |
| `/habitaciones` | Catalogo de habitaciones. |
| `/areas-comunes` | Catalogo de areas comunes. |
| `/reservar` | Flujo de reserva para clientes autenticados. |
| `/pago` | Flujo de pago para clientes autenticados. |
| `/mis-reservas` | Reservas del cliente autenticado. |

### Administracion

| Ruta | Descripcion |
| --- | --- |
| `/admin/dashboard` | Panel principal administrativo. |
| `/admin/habitaciones` | Gestion de habitaciones. |
| `/admin/areas-comunes` | Gestion de areas comunes. |
| `/admin/clientes` | Gestion de clientes. |
| `/admin/reservas` | Gestion de reservas. |
| `/admin/reportes` | Reportes del hotel. |
| `/admin/pagos` | Gestion de pagos. |

Las rutas protegidas usan `ProtectedRoute` y requieren una sesion guardada en `localStorage` con rol `CLIENTE` o `ADMIN`.

## Estructura del proyecto

```text
src/
  components/
    ProtectedRoute.jsx
  pages/
    AdminAreasComunes.jsx
    AdminDashboard.jsx
    AdminHabitaciones.jsx
    AdminPagos.jsx
    AreasComunes.jsx
    ClienteAdmin.jsx
    DetallesDeHabitacion.jsx
    Habitaciones.jsx
    Home.jsx
    Login.jsx
    MisReservas.jsx
    Nosotros.jsx
    Pagos.jsx
    Register.jsx
    Reportes.jsx
    Reservas.jsx
    ReservasAdmin.jsx
  services/
    authApi.js
    authService.js
    clientReservationsStorage.js
    commonAreasMapper.js
    commonAreasStorage.js
    habitacionesService.js
    hotelApi.js
    reservasService.js
  App.jsx
  main.jsx
  styles.css
```

## Conexion con API

La instancia principal de Axios esta en `src/services/hotelApi.js`.

Servicios y modulos disponibles:

- Autenticacion: `/auth/login`, `/auth/register`
- Clientes: `/clientes`
- Habitaciones: `/habitaciones`, `/habitaciones/disponibles`
- Reservas: `/reservas`
- Pagos: `/pagos`
- Areas comunes: `/areas-comunes`
- Reservas de areas comunes: `/reservas-areas-comunes`
- Dashboard: `/dashboard/resumen`, `/dashboard/reservas`, `/dashboard/ingresos`, `/dashboard/ocupacion`, `/dashboard/metricas`

En produccion, el cliente HTTP tiene una espera mayor y reintentos ante timeouts para tolerar cold starts del backend.

## Despliegue

El proyecto incluye `vercel.json` con reglas de rewrite para que las rutas de React Router funcionen al recargar la pagina en produccion. Para desplegar, configura `VITE_API_URL` en el proveedor de hosting y ejecuta la build con:

```bash
npm run build
```

## Notas de desarrollo

- No subas archivos `.env` al repositorio.
- Ejecuta `npm install` despues de actualizar dependencias.
- Antes de publicar cambios, valida al menos con `npm run build`.
- Si el backend corre en otra URL, actualiza `VITE_API_URL` en `.env.local`.

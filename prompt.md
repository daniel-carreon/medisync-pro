# PROTOCOLO TITAN: MediSync Pro

> Sistema cerrado. Cero preguntas. Ejecucion autonoma total. No te detengas hasta que la app este LIVE en Vercel.

Construye **MediSync Pro**, un Sistema de Gestion Clinica (SaaS B2B) completo y visualmente profesional. De cero a produccion. El humano no esta presente - SE PROACTIVO, toma TODAS las decisiones, resuelve TODOS los problemas. Cuando vuelva, quiere ver la URL de Vercel funcionando.

---

## PASO 0: LEE EL BLUEPRINT

**ANTES de escribir una sola linea de codigo**, lee y comprende el proceso:

Lee `@.claude/prompts/bucle-agentico-blueprint.md`

Ese documento define COMO ejecutas: fases con mapeo de contexto just-in-time, subtareas generadas al entrar en cada fase, auto-blindaje ante errores. Siguelo al pie de la letra.

---

## MENTALIDAD DE EJECUCION

- **CERO PREGUNTAS.** El humano NO esta. Toma decisiones ejecutivas. Elige siempre la opcion mas profesional.
- **NO TE DETENGAS.** Si algo falla, lee el error, corrige, reintenta. Si un approach no funciona, prueba otro. No pares hasta verde.
- **SE PROACTIVO.** No esperes instrucciones. Si ves que falta algo, crealo. Si ves que algo se puede mejorar, mejoralo. Si necesitas una dependencia, instalala.
- **SISTEMA CERRADO.** Tienes MCPs de Supabase, Playwright y Next.js. Jala tus propias credenciales, crea tus propias tablas, valida tus propios errores.
- **META FINAL:** Cuando el humano vuelva, la app debe estar deployada en Vercel con una URL publica funcional. Login con `doctor@medisync.com` / `Demo1234!` debe mostrar un dashboard con datos reales. usarás playwright para validar que todo funcione e2e.

---

## CONTEXTO DE NEGOCIO

Las clinicas necesitan un cerebro central. MediSync Pro resuelve:

1. **Gestion de Pacientes (CRM):** Historial, datos de contacto, alergias, notas privadas.
2. **Agenda Inteligente:** Citas con estados (Pendiente, Confirmada, Cancelada, Completada).
3. **Historial Clinico (EMR Lite):** Notas de evolucion por cita (diagnostico + receta).
4. **Control Financiero:** Pagos por consulta. Cuanto gano el doctor hoy/esta semana/este mes.

---

## CRONOMETRO: MIDE TU PROPIA EJECUCION

**PRIMERA ACCION antes de cualquier otra cosa:** Lanza un cronometro en background que corra hasta que tu lo detengas:

```bash
echo "TITAN_START=$(date +%s)" > /tmp/titan-timer.sh && echo "Protocolo Titan iniciado: $(date '+%Y-%m-%d %H:%M:%S')" > /tmp/titan-log.txt
```

Ademas, al INICIAR cada fase, registra el timestamp en el log:

```bash
echo "FASE X iniciada: $(date '+%Y-%m-%d %H:%M:%S')" >> /tmp/titan-log.txt
```

Y al COMPLETAR cada fase:

```bash
echo "FASE X completada: $(date '+%Y-%m-%d %H:%M:%S')" >> /tmp/titan-log.txt
```

Si encuentras un error y lo corriges, registra una linea:

```bash
echo "ERROR [FASE X]: descripcion breve del error y como se resolvio" >> /tmp/titan-log.txt
```

**NO detengas el cronometro hasta que la app este en produccion y el login funcione.**

Al final de todo (despues de Fase 6), detiene el cronometro y genera el reporte:

```bash
source /tmp/titan-timer.sh && TITAN_END=$(date +%s) && TITAN_DURATION=$((TITAN_END - TITAN_START)) && echo "---" >> /tmp/titan-log.txt && echo "PROTOCOLO TITAN COMPLETADO: $(date '+%Y-%m-%d %H:%M:%S')" >> /tmp/titan-log.txt && echo "DURACION TOTAL: $((TITAN_DURATION / 60)) minutos y $((TITAN_DURATION % 60)) segundos" >> /tmp/titan-log.txt
```

Despues lee `/tmp/titan-log.txt` y presenta al usuario un **REPORTE TITAN** con:
- Tiempo total de ejecucion
- Tiempo por fase
- Errores encontrados y como se resolvieron
- Archivos creados (cantidad)
- Tablas creadas en Supabase
- URL de produccion
- Credenciales de acceso demo
- Screenshot final del dashboard

---

## FASES (solo fases, las subtareas se generan al entrar en cada una)

### FASE 0: Infraestructura y Credenciales
- Jalar credenciales de Supabase via MCP (`get_project_url` + `get_publishable_keys`)
- Crear `.env.local` con las credenciales reales
- Instalar dependencias faltantes (`date-fns`, `recharts`, `clsx`, `tailwind-merge`, `lucide-react`, `react-day-picker`)
- Verificar que `npm run dev` levanta sin errores
- Si hay CUALQUIER error al levantar, arreglalo antes de avanzar

### FASE 1: Autenticacion (El Backbone)
- Lee y ejecuta el blueprint de `.claude/commands/add-login.md` paso a paso
- Crear proxy.ts, server actions, hooks, componentes de auth, paginas
- Crear tabla `profiles` via Supabase MCP con RLS y trigger
- Adaptar estilos de auth a la estetica MediSync (ver seccion Diseno)
- Post-login redirige a `/` (root), NO a `/dashboard`
- Verificar con Next.js MCP que no haya errores de compilacion

### FASE 2: Arquitectura de Datos
Crear via Supabase MCP (`apply_migration`). **RLS obligatorio** en TODAS las tablas (`auth.uid() = doctor_id`).

**Tablas:**

```sql
-- patients: CRM de pacientes
-- id (uuid PK), doctor_id (uuid FK auth.users), first_name, last_name, email, phone, gender, date_of_birth (date), allergies (text), notes (text), created_at

-- services: Catalogo de servicios con precios
-- id (uuid PK), doctor_id (uuid FK auth.users), name, description, price (decimal), duration_minutes (int), created_at

-- appointments: El corazon del sistema
-- id (uuid PK), doctor_id (uuid FK auth.users), patient_id (uuid FK patients), service_id (uuid FK services), start_time (timestamptz), end_time (timestamptz), status (text CHECK: pending/confirmed/completed/cancelled), notes (text), created_at

-- medical_notes: Historial clinico por cita
-- id (uuid PK), appointment_id (uuid FK appointments), doctor_id (uuid FK auth.users), diagnosis (text), prescription (text), private_notes (text), created_at

-- payments: Control financiero
-- id (uuid PK), appointment_id (uuid FK appointments), doctor_id (uuid FK auth.users), amount (decimal), status (text CHECK: paid/pending), payment_method (text), payment_date (date), created_at
```

Despues de crear las tablas, ejecuta `get_advisors` de Supabase MCP para verificar que no haya tablas sin RLS.

### FASE 3: UI Completa
Construir toda la interfaz con Tailwind CSS puro. Ver seccion Diseno.

**Rutas a root level.** Sin prefijo `/dashboard`. El login te lleva a `/` que ES el panel principal.

**Layout:**
- `AppLayout` para rutas protegidas (todas menos auth) con sidebar lateral fija
- Menu: Inicio, Agenda, Pacientes, Finanzas
- Header con nombre del doctor y boton Logout
- Responsive: sidebar colapsable en movil

**Paginas:**

1. **Inicio (`/`):**
   - 4 KPI Cards: Pacientes Totales, Citas Hoy, Ingresos del Mes, Tasa de Completadas
   - Grafica de barras (Recharts): Ingresos ultimos 7 dias
   - Lista: Proximas 5 citas con acciones rapidas (Confirmar/Completar)

2. **Pacientes (`/patients`):**
   - Tabla con busqueda por nombre
   - Boton "Nuevo Paciente" → modal/formulario
   - Click en paciente → detalle con datos + historial de citas + notas medicas

3. **Agenda (`/calendar`):**
   - Vista lista de citas ordenada por fecha/hora
   - Filtros por estado (Todas, Pendientes, Confirmadas, Completadas, Canceladas)
   - Boton "Nueva Cita" → formulario: paciente, servicio (autocompleta precio), fecha y hora

4. **Consulta Activa (`/appointments/[id]`):**
   - Datos del paciente y servicio
   - Formulario para nota medica (diagnostico + receta)
   - Boton "Completar Cita" → cambia status + crea pago + guarda nota medica

5. **Finanzas (`/finances`):**
   - Resumen: Ingresos Hoy, Esta Semana, Este Mes
   - Tabla de pagos recientes con filtro por estado

**Server Components para fetch, Server Actions para mutaciones. 'use client' solo donde sea estrictamente necesario (formularios interactivos, graficas).**

### FASE 4: Datos Semilla (El Aliento de Vida)
La app NO puede nacer vacia.

1. Crear usuario demo via Supabase Auth: `doctor@medisync.com` / `Demo1234!`
2. Insertar datos realistas con el `doctor_id` de ese usuario:
   - 5 Servicios: Consulta General ($50), Revision Pediatrica ($65), Urgencia ($95), Limpieza Dental ($40), Control Prenatal ($75)
   - 10 Pacientes con nombres hispanos realistas, edades variadas, alergias reales
   - 15 Citas: 5 completadas (pasadas), 5 para hoy (pendientes/confirmadas), 5 futuras
   - Notas medicas y pagos para las 5 citas completadas

**El Dashboard DEBE mostrar numeros reales, graficas con datos y citas proximas.**

### FASE 5: Validacion
- Levantar `npm run dev` si no esta corriendo
- Verificar TODAS las rutas con Next.js MCP (get_errors). Si hay errores, arreglalos.
- Screenshot del dashboard con Playwright para confirmar que se ve bien
- Confirmar que login con `doctor@medisync.com` / `Demo1234!` funciona
- Si algo falla, corrige y re-valida. No avances hasta que todo este verde.

### FASE 6: Despliegue (GitHub + Vercel)
- Inicializar git: `git init && git add -A && git commit -m "Initial commit: MediSync Pro"`
- Crear repo en GitHub: `gh repo create medisync-pro --public --source=. --push`
- Si `gh` no esta autenticado o falla, intenta con `git remote add origin` + `git push`
- Deploy a Vercel: `vercel --yes` para link + deploy automatico
- Configurar env vars en Vercel: `vercel env add NEXT_PUBLIC_SUPABASE_URL production` (y las demas)
- Deploy a produccion: `vercel --prod`
- Verificar que la URL de produccion carga correctamente
- **REPORTAR la URL final al usuario**

---

## DISENO: Clean Medical Professional

```
PALETA:
- Fondo general: bg-slate-50
- Cards/Paneles: bg-white shadow-sm rounded-xl border border-slate-200
- Acento principal: blue-600 (botones, links, iconos activos)
- Acento secundario: emerald-500 (completado, pagado, positivo)
- Alerta/Cancelado: red-500
- Pendiente: amber-500
- Texto principal: text-slate-900
- Texto secundario: text-slate-500
- Bordes: border-slate-200

TIPOGRAFIA:
- Font: Inter (Google Fonts)
- Headings: font-semibold
- Body: font-normal text-sm

COMPONENTES:
- Cards: bg-white rounded-xl shadow-sm border border-slate-200 p-6
- Botones primarios: bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition
- Botones secundarios: bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50
- Inputs: border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500
- Badges de estado:
  - Pendiente: bg-amber-100 text-amber-800
  - Confirmada: bg-blue-100 text-blue-800
  - Completada: bg-emerald-100 text-emerald-800
  - Cancelada: bg-red-100 text-red-800
  - Pagado: bg-emerald-100 text-emerald-800
- Tablas: divide-y divide-slate-200, hover:bg-slate-50 en rows
- Sidebar: bg-white border-r border-slate-200, iconos lucide-react

ESPACIADO:
- Entre secciones: space-y-6
- Padding pagina: p-6 lg:p-8
- Grid KPIs: grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6
```

---

## ARQUITECTURA FEATURE-FIRST

```
src/
  features/
    auth/          -> componentes, hooks, services de autenticacion
    dashboard/     -> KPIs, graficas, resumen
    patients/      -> CRUD pacientes, detalle, historial
    appointments/  -> Agenda, nueva cita, consulta activa
    finances/      -> Resumen financiero, tabla de pagos
  shared/
    components/    -> AppLayout, Sidebar, KPICard, StatusBadge, DataTable
    lib/           -> supabase clients (ya existen)
    types/         -> tipos de DB compartidos
```

---

## RECORDATORIOS CRITICOS

- `proxy.ts` en la raiz, NO `middleware.ts` (Next.js 16)
- Supabase SSR: `getAll()` / `setAll()`, NUNCA `get()` / `set()` / `remove()`
- Server side: siempre `getUser()`, NUNCA `getSession()`
- RLS en TODAS las tablas sin excepcion
- Server Actions con `'use server'` para mutaciones
- Precios en dolares (USD) con formato $XX.XX
- Fechas en espanol legible: "Lun 3 Feb, 10:00 AM"
- `npm run dev` para levantar, NUNCA `next dev` directo
- Post-login redirige a `/` (root). Rutas a root level: `/patients`, `/calendar`, `/finances`, NO bajo `/dashboard`
- Proxy protege TODAS las rutas excepto auth (`/login`, `/signup`, `/forgot-password`, `/update-password`, `/check-email`)
- `.env.local` se crea automaticamente via Supabase MCP
- Si un error bloquea el avance, ARREGLALO. No lo reportes esperando respuesta.

---

**LEE EL BLUEPRINT. EJECUTA LAS FASES. NO TE DETENGAS HASTA QUE LA URL DE VERCEL ESTE LIVE. LUZ VERDE.**

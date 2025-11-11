# Casos de Uso: CRM Zypher para Ferretería

## Perspectiva del Usuario Final
Este documento describe cómo un dueño de ferretería (Juan Pérez) utiliza el sistema CRM+Facturación para gestionar su negocio día a día.

---

## Caso 1: Cotización/Quote con Productos en Deal

### Escenario
Carlos Morales llama a la ferretería pidiendo una cotización para materiales de construcción de 3 casas.

### Flujo Completo

```
┌─────────────────────────────────────────────────────────────────┐
│  PASO 1: RECEPCIÓN DE LA LLAMADA                                │
│                                                                   │
│  ☎️  Juan (dueño) recibe llamada de Carlos Morales              │
│     "Necesito cotización para materiales de 3 casas"            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  PASO 2: CREAR/BUSCAR CONTACTO EN CRM                           │
│                                                                   │
│  [CRM - Módulo Contactos]                                        │
│  ┌───────────────────────────────────────────────────┐          │
│  │ 🔍 Buscar: "Carlos Morales"                       │          │
│  │                                                     │          │
│  │ ❌ No encontrado → [+ Crear Nuevo Contacto]       │          │
│  │                                                     │          │
│  │ ✏️  Nombre: Carlos Morales                         │          │
│  │    Teléfono: 099-XXX-XXXX                          │          │
│  │    Email: carlos@email.com                         │          │
│  │    Empresa: Constructora Morales                   │          │
│  │    Tipo: Cliente Potencial                         │          │
│  │                                                     │          │
│  │             [💾 Guardar Contacto]                  │          │
│  └───────────────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  PASO 3: CREAR NEGOCIACIÓN (DEAL)                               │
│                                                                   │
│  [CRM - Módulo Negociaciones]                                    │
│  ┌───────────────────────────────────────────────────┐          │
│  │ [+ Crear Nueva Negociación]                        │          │
│  │                                                     │          │
│  │ 📋 Título: Materiales 3 casas - Constructora      │          │
│  │ 👤 Contacto: Carlos Morales                        │          │
│  │ 📊 Etapa: LEAD → CONTACTED                         │          │
│  │ 💰 Valor Estimado: $15,000.00                      │          │
│  │ 📅 Fecha Cierre Estimada: 2025-12-15              │          │
│  │ ⚡ Prioridad: ALTA                                 │          │
│  │ 📝 Descripción: Proyecto 3 casas residenciales    │          │
│  │                                                     │          │
│  │             [💾 Guardar Negociación]               │          │
│  └───────────────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  PASO 4: AGREGAR PRODUCTOS A LA NEGOCIACIÓN                     │
│                                                                   │
│  [Deal Detail - Tab Productos]                                   │
│  ┌───────────────────────────────────────────────────┐          │
│  │ Deal: Materiales 3 casas                           │          │
│  │                                                     │          │
│  │ [+ Agregar Producto]                               │          │
│  │                                                     │          │
│  │ ╔═══════════════════════════════════════════════╗ │          │
│  │ ║ Producto 1: Cemento Chimborazo 50kg           ║ │          │
│  │ ║ Cantidad: 100 sacos                           ║ │          │
│  │ ║ Precio Unit: $8.50                            ║ │          │
│  │ ║ Subtotal: $850.00                             ║ │          │
│  │ ╚═══════════════════════════════════════════════╝ │          │
│  │                                                     │          │
│  │ ╔═══════════════════════════════════════════════╗ │          │
│  │ ║ Producto 2: Varilla 12mm (6m)                 ║ │          │
│  │ ║ Cantidad: 200 unidades                        ║ │          │
│  │ ║ Precio Unit: $9.20                            ║ │          │
│  │ ║ Subtotal: $1,840.00                           ║ │          │
│  │ ╚═══════════════════════════════════════════════╝ │          │
│  │                                                     │          │
│  │ ╔═══════════════════════════════════════════════╗ │          │
│  │ ║ Producto 3: Arena lavada (m³)                 ║ │          │
│  │ ║ Cantidad: 15 m³                               ║ │          │
│  │ ║ Precio Unit: $22.00                           ║ │          │
│  │ ║ Subtotal: $330.00                             ║ │          │
│  │ ╚═══════════════════════════════════════════════╝ │          │
│  │                                                     │          │
│  │ ╔═══════════════════════════════════════════════╗ │          │
│  │ ║ Producto 4: Bloque 20x20x40cm                 ║ │          │
│  │ ║ Cantidad: 3,000 unidades                      ║ │          │
│  │ ║ Precio Unit: $0.45                            ║ │          │
│  │ ║ Subtotal: $1,350.00                           ║ │          │
│  │ ╚═══════════════════════════════════════════════╝ │          │
│  │                                                     │          │
│  │ ─────────────────────────────────────────────────  │          │
│  │ 💰 TOTAL COTIZACIÓN: $4,370.00                    │          │
│  │ 📊 IVA (15%): $655.50                             │          │
│  │ 💵 TOTAL CON IVA: $5,025.50                       │          │
│  │                                                     │          │
│  │     [📄 Generar Cotización PDF]                    │          │
│  └───────────────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  PASO 5: GENERAR Y ENVIAR COTIZACIÓN                            │
│                                                                   │
│  Sistema genera PDF con:                                         │
│  • Logo de la ferretería                                         │
│  • Datos del contacto                                            │
│  • Lista de productos con precios                                │
│  • Total                                                         │
│  • Validez de la oferta (15 días)                               │
│  • Términos y condiciones                                        │
│                                                                   │
│  Juan envía la cotización:                                       │
│  ✉️  Email a carlos@email.com                                   │
│  📱 WhatsApp                                                     │
│                                                                   │
│  [CRM actualiza automáticamente]                                 │
│  Deal → QUALIFIED (Calificado)                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  PASO 6: SEGUIMIENTO Y NEGOCIACIÓN                              │
│                                                                   │
│  [CRM - Módulo Tareas]                                           │
│  ┌───────────────────────────────────────────────────┐          │
│  │ 📋 Nueva Tarea:                                    │          │
│  │    "Llamar a Carlos - Seguimiento cotización"     │          │
│  │    Fecha: 2025-11-12 (en 3 días)                  │          │
│  │    Relacionado con: Deal #123                      │          │
│  └───────────────────────────────────────────────────┘          │
│                                                                   │
│  Días después...                                                 │
│  ☎️  Carlos llama: "Me interesa, pero necesito descuento"       │
│                                                                   │
│  Juan actualiza el Deal:                                         │
│  • Etapa: QUALIFIED → PROPOSAL                                   │
│  • Ajusta precios (descuento 5%)                                 │
│  • Valor Final: $4,774.72 (con IVA)                             │
│  • Genera nueva cotización                                       │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  PASO 7: CIERRE Y FACTURACIÓN                                   │
│                                                                   │
│  ☎️  Carlos acepta: "Está bien, cuando entrego anticipo?"       │
│                                                                   │
│  Juan en el CRM:                                                 │
│  1. Actualiza Deal → WON (Ganado) ✅                             │
│  2. Click en [🧾 Generar Factura]                               │
│                                                                   │
│  [Sistema de Facturación Electrónica]                            │
│  ┌───────────────────────────────────────────────────┐          │
│  │ 📄 Nueva Factura                                   │          │
│  │                                                     │          │
│  │ Cliente: Carlos Morales                            │          │
│  │ RUC: XXXXXXXXXXXX                                  │          │
│  │                                                     │          │
│  │ [Los productos ya están cargados del Deal]        │          │
│  │                                                     │          │
│  │ • Cemento Chimborazo 50kg x100                    │          │
│  │ • Varilla 12mm x200                               │          │
│  │ • Arena lavada x15 m³                             │          │
│  │ • Bloque 20x20x40 x3000                           │          │
│  │                                                     │          │
│  │ Subtotal: $4,151.50                               │          │
│  │ IVA 15%: $622.73                                  │          │
│  │ TOTAL: $4,774.23                                  │          │
│  │                                                     │          │
│  │ Forma de pago: [Anticipo 30%]                     │          │
│  │                                                     │          │
│  │        [🚀 Generar y Enviar al SRI]                │          │
│  └───────────────────────────────────────────────────┘          │
│                                                                   │
│  Sistema automáticamente:                                        │
│  ✅ Firma electrónicamente                                       │
│  ✅ Envía al SRI (autorización)                                  │
│  ✅ Recibe clave de acceso                                       │
│  ✅ Envía XML y PDF al cliente                                   │
│  ✅ Marca el Deal como FACTURADO                                 │
│  ✅ Actualiza inventario                                         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  RESULTADO FINAL                                                 │
│                                                                   │
│  ✅ Carlos Morales ahora es "Cliente Activo"                    │
│  ✅ Deal cerrado: $4,774.23                                     │
│  ✅ Factura electrónica emitida                                 │
│  ✅ Inventario actualizado                                      │
│  ✅ Historial completo guardado                                 │
│                                                                   │
│  Juan puede ver en el Dashboard:                                 │
│  📊 Ventas del mes actualizadas                                 │
│  📈 Pipeline de negociaciones                                   │
│  💰 Ingresos proyectados vs reales                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## Caso 2: Lead sin Compra Inmediata - Seguimiento a Largo Plazo

### Escenario
María Torres llama preguntando precios, pero no necesita comprar ahora (va a remodelar en 2 meses).

### Flujo Completo

```
┌─────────────────────────────────────────────────────────────────┐
│  PASO 1: RECEPCIÓN DE CONSULTA                                  │
│                                                                   │
│  ☎️  María Torres llama:                                        │
│     "Hola, estoy planeando remodelar mi casa en 2 meses"       │
│     "¿Cuánto cuesta el piso cerámico?"                          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  PASO 2: REGISTRAR CONTACTO                                     │
│                                                                   │
│  [CRM - Contactos]                                               │
│  ┌───────────────────────────────────────────────────┐          │
│  │ + Nuevo Contacto                                   │          │
│  │                                                     │          │
│  │ Nombre: María Torres                               │          │
│  │ Teléfono: 098-XXX-XXXX                             │          │
│  │ Email: maria.torres@email.com                      │          │
│  │ Origen: Llamada telefónica                         │          │
│  │ Interés: Remodelación (piso cerámico)             │          │
│  │ Notas: "Proyecta iniciar en 2 meses"              │          │
│  │                                                     │          │
│  │             [💾 Guardar]                           │          │
│  └───────────────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  PASO 3: CREAR NEGOCIACIÓN (SIN PRODUCTOS AÚN)                  │
│                                                                   │
│  [CRM - Negociaciones]                                           │
│  ┌───────────────────────────────────────────────────┐          │
│  │ + Nueva Negociación                                │          │
│  │                                                     │          │
│  │ Título: Remodelación casa - María Torres          │          │
│  │ Contacto: María Torres                             │          │
│  │ Etapa: LEAD (Prospecto)                            │          │
│  │ Valor Estimado: $3,000 (tentativo)                │          │
│  │ Fecha Cierre Estimada: 2026-01-15                 │          │
│  │ Prioridad: MEDIA                                   │          │
│  │ Descripción: "Cliente interesado en pisos         │          │
│  │              cerámicos para remodelación.          │          │
│  │              Inicio estimado en 2 meses"           │          │
│  │                                                     │          │
│  │ ❌ NO se agregan productos aún                     │          │
│  │    (solo es una consulta inicial)                  │          │
│  │                                                     │          │
│  │             [💾 Crear Negociación]                 │          │
│  └───────────────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  PASO 4: PROGRAMAR SEGUIMIENTO                                  │
│                                                                   │
│  [CRM - Tareas]                                                  │
│  ┌───────────────────────────────────────────────────┐          │
│  │ 📋 Tarea 1:                                        │          │
│  │    Título: Enviar catálogo de pisos               │          │
│  │    Para: HOY (2025-11-09)                          │          │
│  │    Deal: Remodelación María Torres                │          │
│  │    [✅ Completar]                                  │          │
│  └───────────────────────────────────────────────────┘          │
│                                                                   │
│  ┌───────────────────────────────────────────────────┐          │
│  │ 📋 Tarea 2:                                        │          │
│  │    Título: Llamar a María - 1er seguimiento       │          │
│  │    Para: 2025-11-23 (en 2 semanas)                │          │
│  │    Deal: Remodelación María Torres                │          │
│  │    Nota: "Preguntar si ya tiene diseño final"     │          │
│  └───────────────────────────────────────────────────┘          │
│                                                                   │
│  ┌───────────────────────────────────────────────────┐          │
│  │ 📋 Tarea 3:                                        │          │
│  │    Título: Seguimiento final - Cotización         │          │
│  │    Para: 2025-12-20 (en 6 semanas)                │          │
│  │    Deal: Remodelación María Torres                │          │
│  │    Nota: "Preparar cotización formal"             │          │
│  └───────────────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  TIMELINE DE SEGUIMIENTO                                         │
│                                                                   │
│  DÍA 1 (HOY):                                                    │
│  Juan envía por WhatsApp:                                        │
│  • Catálogo de pisos en PDF                                     │
│  • Lista de precios                                              │
│  • Fotos de trabajos anteriores                                  │
│  Deal permanece en: LEAD                                         │
│                                                                   │
│  ─────────────────────────────────────────────────────           │
│                                                                   │
│  2 SEMANAS DESPUÉS:                                              │
│  ⏰ Sistema le recuerda a Juan la tarea                          │
│  ☎️  Juan llama a María                                         │
│  "Hola María, ¿cómo va el proyecto de remodelación?"           │
│                                                                   │
│  María responde: "Ya tengo el diseño, necesito 45m² de piso"   │
│                                                                   │
│  Juan actualiza en CRM:                                          │
│  • Deal → CONTACTED (Contactado)                                 │
│  • Agrega nota: "45m² de piso cerámico"                         │
│  • Actualiza valor estimado: $2,700                             │
│                                                                   │
│  ─────────────────────────────────────────────────────           │
│                                                                   │
│  6 SEMANAS DESPUÉS:                                              │
│  ⏰ Sistema le recuerda a Juan                                   │
│  ☎️  Juan llama nuevamente                                      │
│                                                                   │
│  María: "Sí, ya voy a empezar. Necesito la cotización formal"  │
│                                                                   │
│  AHORA SÍ Juan agrega productos al Deal:                         │
│  ┌───────────────────────────────────────────────────┐          │
│  │ 🏺 Piso cerámico 60x60 Graiman                    │          │
│  │    45 m² x $45/m² = $2,025.00                     │          │
│  │                                                     │          │
│  │ 🧱 Pegamento para cerámica                         │          │
│  │    6 sacos x $12 = $72.00                          │          │
│  │                                                     │          │
│  │ 🎨 Fragüe color gris                               │          │
│  │    3 kg x $8 = $24.00                              │          │
│  │                                                     │          │
│  │ TOTAL: $2,121.00 + IVA = $2,439.15                │          │
│  └───────────────────────────────────────────────────┘          │
│                                                                   │
│  • Genera cotización PDF                                         │
│  • Deal → PROPOSAL (Propuesta)                                   │
│  • Envía cotización por email y WhatsApp                         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  PASO 5: CIERRE                                                  │
│                                                                   │
│  María acepta la cotización y pasa a retirar                     │
│                                                                   │
│  Juan:                                                           │
│  1. Deal → WON ✅                                                │
│  2. [🧾 Generar Factura] desde el Deal                          │
│  3. Sistema carga automáticamente los productos                  │
│  4. Genera factura electrónica                                   │
│  5. Envía al SRI                                                 │
│  6. Entrega productos                                            │
│                                                                   │
│  ✅ María Torres ahora es cliente activo                        │
│  ✅ Historial completo de 2 meses de seguimiento                │
└─────────────────────────────────────────────────────────────────┘

```

**CLAVE DE ESTE CASO:**
- NO se agregan productos al inicio (solo es consulta)
- Se usa el CRM para SEGUIMIENTO programado
- Los productos se agregan solo cuando el cliente está listo para comprar
- Sistema de tareas ayuda a no olvidar llamar al cliente

---

## Caso 3: Cliente Recurrente - Venta Rápida

### Escenario
Carlos (cliente conocido) llega a comprar su pedido semanal de cemento.

### Flujo Completo

```
┌─────────────────────────────────────────────────────────────────┐
│  OPCIÓN A: FACTURACIÓN DIRECTA (SIN DEAL)                       │
│  Para ventas rápidas recurrentes                                 │
│                                                                   │
│  Carlos llega al mostrador:                                      │
│  "Hola Juan, lo de siempre: 50 sacos de cemento"                │
│                                                                   │
│  Juan va directo a:                                              │
│  [💰 Módulo Facturación]                                         │
│  ┌───────────────────────────────────────────────────┐          │
│  │ Nueva Factura                                      │          │
│  │                                                     │          │
│  │ Cliente: [🔍 Carlos Morales] ← ya existe          │          │
│  │                                                     │          │
│  │ Producto: Cemento Chimborazo 50kg                 │          │
│  │ Cantidad: 50                                       │          │
│  │ Precio: $8.50                                      │          │
│  │ Subtotal: $425.00                                 │          │
│  │                                                     │          │
│  │ Total + IVA: $488.75                              │          │
│  │                                                     │          │
│  │ Pago: [Efectivo] [Transferencia] [Crédito]       │          │
│  │                                                     │          │
│  │        [🚀 Facturar]                               │          │
│  └───────────────────────────────────────────────────┘          │
│                                                                   │
│  ✅ Factura generada en 30 segundos                             │
│  ✅ Sin necesidad de crear Deal                                 │
│  ✅ Perfecto para ventas recurrentes                            │
└─────────────────────────────────────────────────────────────────┘

                              O

┌─────────────────────────────────────────────────────────────────┐
│  OPCIÓN B: CON DEAL RÁPIDO                                      │
│  Para trackear esta venta en estadísticas                        │
│                                                                   │
│  [CRM - Vista Rápida]                                            │
│  ┌───────────────────────────────────────────────────┐          │
│  │ ⚡ Quick Deal                                      │          │
│  │                                                     │          │
│  │ Cliente: Carlos Morales                            │          │
│  │ Título: Pedido semanal cemento                     │          │
│  │                                                     │          │
│  │ [+ Cemento x50 = $425.00]                          │          │
│  │                                                     │          │
│  │ [✅ Crear y Facturar]                              │          │
│  └───────────────────────────────────────────────────┘          │
│                                                                   │
│  Sistema automáticamente:                                        │
│  1. Crea Deal en estado WON                                      │
│  2. Genera factura electrónica                                   │
│  3. Actualiza estadísticas del mes                               │
│  4. Mantiene historial del cliente                               │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  ¿CUÁNDO USAR CADA OPCIÓN?                                      │
│                                                                   │
│  OPCIÓN A (Sin Deal):                                            │
│  ✅ Ventas pequeñas recurrentes                                 │
│  ✅ Clientes que compran lo mismo siempre                       │
│  ✅ Cuando necesitas velocidad                                   │
│  ✅ Productos de bajo valor                                      │
│                                                                   │
│  OPCIÓN B (Con Deal):                                            │
│  ✅ Quieres métricas detalladas                                 │
│  ✅ Trackear frecuencia de compra                               │
│  ✅ Análisis de clientes recurrentes                            │
│  ✅ Reportes de ventas por cliente                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## Caso 4: Proyecto Grande a Largo Plazo

### Escenario
Constructora XYZ contrata a Juan para suministrar materiales durante 6 meses (obra grande).

### Flujo Completo

```
┌─────────────────────────────────────────────────────────────────┐
│  CONTEXTO                                                        │
│                                                                   │
│  🏗️  Proyecto: Edificio de 5 pisos                             │
│  📅 Duración: 6 meses                                            │
│  💰 Valor Total Estimado: $85,000                               │
│  📦 Entregas: Semanales según avance de obra                    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  PASO 1: CREAR DEAL MAESTRO                                     │
│                                                                   │
│  [CRM - Negociaciones]                                           │
│  ┌───────────────────────────────────────────────────┐          │
│  │ + Nueva Negociación                                │          │
│  │                                                     │          │
│  │ Título: Suministro Edificio 5 pisos - XYZ         │          │
│  │ Cliente: Constructora XYZ                          │          │
│  │ Etapa: NEGOTIATION (en negociación)               │          │
│  │ Valor Total: $85,000.00                           │          │
│  │ Fecha Inicio: 2025-11-15                          │          │
│  │ Fecha Fin Estimada: 2026-05-15                    │          │
│  │ Prioridad: ALTA                                   │          │
│  │                                                     │          │
│  │ 📋 Descripción:                                    │          │
│  │    "Suministro completo de materiales para        │          │
│  │     edificio de 5 pisos. Entregas semanales       │          │
│  │     según cronograma de obra."                     │          │
│  │                                                     │          │
│  │ 📎 Adjuntos:                                       │          │
│  │    • Contrato firmado.pdf                          │          │
│  │    • Cronograma de obra.xlsx                       │          │
│  │    • Planos estructurales.pdf                      │          │
│  └───────────────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  PASO 2: AGREGAR LISTA COMPLETA DE PRODUCTOS                    │
│                                                                   │
│  [Deal Detail - Tab Productos]                                   │
│  ┌───────────────────────────────────────────────────┐          │
│  │ FASE 1: CIMENTACIÓN (Mes 1)                       │          │
│  │ ├─ Cemento 50kg: 500 sacos                        │          │
│  │ ├─ Varilla 12mm: 1,000 unidades                   │          │
│  │ ├─ Varilla 18mm: 500 unidades                     │          │
│  │ ├─ Arena: 40 m³                                    │          │
│  │ ├─ Ripio: 60 m³                                    │          │
│  │ └─ Subtotal Fase 1: $18,500                       │          │
│  │                                                     │          │
│  │ FASE 2: ESTRUCTURA (Mes 2-3)                      │          │
│  │ ├─ Cemento 50kg: 800 sacos                        │          │
│  │ ├─ Varilla 12mm: 2,000 unidades                   │          │
│  │ ├─ Bloque 20x20x40: 15,000 unidades              │          │
│  │ ├─ Alambre galvanizado: 100 kg                    │          │
│  │ └─ Subtotal Fase 2: $35,200                       │          │
│  │                                                     │          │
│  │ FASE 3: MAMPOSTERÍA (Mes 4)                       │          │
│  │ ├─ Bloque 10x20x40: 8,000 unidades               │          │
│  │ ├─ Cemento 50kg: 300 sacos                        │          │
│  │ ├─ Arena fina: 20 m³                               │          │
│  │ └─ Subtotal Fase 3: $12,800                       │          │
│  │                                                     │          │
│  │ FASE 4: ACABADOS (Mes 5-6)                        │          │
│  │ ├─ Cerámica piso: 500 m²                          │          │
│  │ ├─ Cerámica pared: 300 m²                         │          │
│  │ ├─ Pegamento: 200 sacos                           │          │
│  │ ├─ Fragüe: 150 kg                                 │          │
│  │ └─ Subtotal Fase 4: $18,500                       │          │
│  │                                                     │          │
│  │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │          │
│  │ 💰 VALOR TOTAL PROYECTO: $85,000.00               │          │
│  │ 📊 IVA: $12,750.00                                │          │
│  │ 💵 TOTAL CON IVA: $97,750.00                      │          │
│  └───────────────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  PASO 3: EJECUCIÓN - ENTREGAS SEMANALES                         │
│                                                                   │
│  SEMANA 1: (Inicio de cimentación)                               │
│  ┌───────────────────────────────────────────────────┐          │
│  │ Constructora XYZ solicita:                         │          │
│  │ • Cemento 50kg: 100 sacos                          │          │
│  │ • Varilla 12mm: 200 unidades                       │          │
│  │ • Arena: 10 m³                                      │          │
│  │                                                     │          │
│  │ Juan genera FACTURA #001:                          │          │
│  │ [🧾 Generar Factura Parcial]                       │          │
│  │ Valor: $3,420.00 + IVA                            │          │
│  │                                                     │          │
│  │ Sistema actualiza:                                 │          │
│  │ ✅ Factura vinculada al Deal                       │          │
│  │ ✅ Valor facturado: $3,933 de $97,750 (4%)        │          │
│  │ ✅ Productos deducidos del inventario              │          │
│  │ ✅ Deal permanece NEGOTIATION (en ejecución)      │          │
│  └───────────────────────────────────────────────────┘          │
│                                                                   │
│  SEMANA 2:                                                       │
│  Factura #002: $2,890 + IVA                                     │
│  Acumulado: $7,256 de $97,750 (7.4%)                           │
│                                                                   │
│  SEMANA 3:                                                       │
│  Factura #003: $4,120 + IVA                                     │
│  Acumulado: $11,994 de $97,750 (12.3%)                         │
│                                                                   │
│  ... (continúa cada semana durante 6 meses)                      │
│                                                                   │
│  SEMANA 24: (Última entrega)                                     │
│  Factura #024: $3,200 + IVA                                     │
│  Acumulado: $97,750 de $97,750 (100%) ✅                       │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  PASO 4: VISTA DE PROGRESO EN EL DEAL                           │
│                                                                   │
│  [CRM - Deal Detail - Tab Facturación]                           │
│  ┌───────────────────────────────────────────────────┐          │
│  │ 📊 Progreso del Proyecto                           │          │
│  │                                                     │          │
│  │ ████████████████████████░░░░░░░░░░░░░░░░ 60%      │          │
│  │                                                     │          │
│  │ Valor Contratado: $97,750.00                      │          │
│  │ Valor Facturado: $58,650.00                       │          │
│  │ Pendiente: $39,100.00                             │          │
│  │                                                     │          │
│  │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │          │
│  │                                                     │          │
│  │ 📄 FACTURAS EMITIDAS:                              │          │
│  │                                                     │          │
│  │ ✅ #001 | 2025-11-15 | $3,933    | Pagado         │          │
│  │ ✅ #002 | 2025-11-22 | $3,324    | Pagado         │          │
│  │ ✅ #003 | 2025-11-29 | $4,738    | Pagado         │          │
│  │ ✅ #004 | 2025-12-06 | $5,201    | Pagado         │          │
│  │ ... (continúa)                                     │          │
│  │ ⏳ #015 | 2026-02-14 | $4,150    | Pendiente      │          │
│  │                                                     │          │
│  │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │          │
│  │                                                     │          │
│  │ 📅 PRÓXIMA ENTREGA:                                │          │
│  │    Fecha: 2026-02-21                               │          │
│  │    Productos: Cemento x150, Bloque x2000          │          │
│  │    Valor Est: $4,890                               │          │
│  │                                                     │          │
│  │    [🔔 Recordarme] [📝 Preparar Pedido]           │          │
│  └───────────────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  PASO 5: CIERRE DEL PROYECTO                                    │
│                                                                   │
│  Última entrega completada (Semana 24)                           │
│                                                                   │
│  Juan verifica:                                                  │
│  ✅ 24 facturas emitidas                                        │
│  ✅ Valor total: $97,750.00 (100%)                              │
│  ✅ Todas las facturas pagadas                                  │
│  ✅ Sin pendientes                                               │
│                                                                   │
│  [Marcar Deal como WON] ✅                                       │
│                                                                   │
│  Sistema genera:                                                 │
│  📊 Reporte Final del Proyecto                                   │
│     • Duración real: 24 semanas                                  │
│     • Total facturado: $97,750.00                               │
│     • Rentabilidad: 18% (según costos)                          │
│     • Productos entregados: 156 tipos diferentes                │
│     • Puntualidad: 95% entregas a tiempo                        │
│                                                                   │
│  ✅ Constructora XYZ ahora es "Cliente Premium"                 │
│  ✅ Historial completo de 6 meses guardado                      │
│  ✅ Base para futuros proyectos similares                       │
└─────────────────────────────────────────────────────────────────┘
```

**CLAVE DE ESTE CASO:**
- UN SOLO DEAL para TODO el proyecto
- Múltiples facturas vinculadas al mismo Deal
- Seguimiento de progreso en tiempo real
- Deal solo se marca WON al finalizar completamente
- Perfecto para contratos a largo plazo

---

## Resumen Comparativo

```
╔═══════════════════════════════════════════════════════════════╗
║  CUÁNDO USAR CADA FLUJO                                        ║
╚═══════════════════════════════════════════════════════════════╝

📋 CASO 1: COTIZACIÓN CON PRODUCTOS
   ✅ Cliente pide precios para compra inmediata
   ✅ Necesitas enviar cotización formal
   ✅ Productos se agregan AL INICIO
   ✅ Tiempo: Días a semanas

📞 CASO 2: LEAD SIN COMPRA INMEDIATA
   ✅ Cliente consulta pero no compra YA
   ✅ Necesitas seguimiento programado
   ✅ Productos se agregan DESPUÉS (cuando esté listo)
   ✅ Tiempo: Semanas a meses

⚡ CASO 3: VENTA RÁPIDA RECURRENTE
   ✅ Cliente conocido, compra habitual
   ✅ No necesita cotización
   ✅ Puedes ir directo a facturación
   ✅ Tiempo: Inmediato (minutos)

🏗️ CASO 4: PROYECTO GRANDE
   ✅ Contrato a largo plazo
   ✅ Múltiples entregas
   ✅ UN Deal, MUCHAS facturas
   ✅ Tiempo: Meses

╔═══════════════════════════════════════════════════════════════╗
║  INTEGRACIÓN CRM + PRODUCTOS + FACTURACIÓN                     ║
╚═══════════════════════════════════════════════════════════════╝

El flujo SIEMPRE es:

  CONTACTO → DEAL → PRODUCTOS → COTIZACIÓN → FACTURA
     ↓         ↓        ↓           ↓            ↓
   [CRM]   [CRM]  [CRM/Prod]  [Sistema]   [Facturación]

EXCEPTO para ventas rápidas:

  CONTACTO (ya existe) → FACTURA DIRECTA
                             ↓
                      [Facturación]
```

---

## Conclusión

El sistema **Zypher CRM + Facturación** permite al dueño de ferretería (Juan) gestionar desde simples ventas de mostrador hasta proyectos complejos de 6 meses, todo desde una sola plataforma integrada.

**Beneficios clave:**
- ✅ No pierde clientes por falta de seguimiento
- ✅ Cotizaciones profesionales en minutos
- ✅ Facturación electrónica automática
- ✅ Control total de proyectos grandes
- ✅ Estadísticas de ventas en tiempo real
- ✅ Historial completo de cada cliente

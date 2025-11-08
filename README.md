# 🚀 Zypher CRM

CRM Multi-industria adaptable para pequeñas y medianas empresas.

## 📋 Características

- ✅ Gestión de Contactos
- ✅ Pipeline de Ventas (Deals)
- ✅ Sistema de Tareas
- ✅ Dashboard con Analytics
- ✅ Templates por Industria (Inmobiliaria, Médica, etc.)
- ✅ Campos personalizables
- ✅ Autenticación con JWT
- ✅ API RESTful con FastAPI
- ✅ Frontend moderno con React + TypeScript

## 🛠️ Stack Tecnológico

### Backend
- **FastAPI** - Framework web Python
- **SQLAlchemy** - ORM
- **PostgreSQL** - Base de datos
- **Pydantic** - Validación de datos
- **JWT** - Autenticación

### Frontend
- **React 19** + **TypeScript**
- **Vite** - Build tool
- **TailwindCSS** - Estilos
- **Zustand** - State management
- **React Query** - Data fetching
- **Axios** - HTTP client
- **Lucide React** - Iconos

## 🚀 Instalación y Configuración

### Prerequisitos
- Python 3.11+
- Node.js 20+
- PostgreSQL 14+

### 1. Configurar Backend

```bash
cd backend

# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# Crear base de datos PostgreSQL
createdb zypher_crm

# Ejecutar migraciones
alembic upgrade head

# Iniciar servidor
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend corriendo en: http://localhost:8000
Documentación API: http://localhost:8000/docs

### 2. Configurar Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Frontend corriendo en: http://localhost:5173

## 📁 Estructura del Proyecto

```
zypher-crm/
├── backend/
│   ├── app/
│   │   ├── api/v1/         # Endpoints de la API
│   │   ├── core/           # Configuración, DB, Security
│   │   ├── models/         # Modelos SQLAlchemy
│   │   ├── schemas/        # Schemas Pydantic
│   │   └── main.py         # Aplicación principal
│   ├── alembic/            # Migraciones
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── components/     # Componentes React
    │   ├── pages/          # Páginas
    │   ├── services/       # API calls
    │   ├── stores/         # Zustand stores
    │   ├── lib/            # Utilidades
    │   └── App.tsx
    └── package.json
```

## 🔑 Uso

### Crear primer usuario

```bash
# Desde el backend, ejecutar:
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123",
    "full_name": "Admin User"
  }'
```

Luego iniciar sesión en http://localhost:5173/login

## 🎨 Templates de Industria

El CRM soporta diferentes templates:

- **Generic** - Uso general
- **Real Estate** - Inmobiliarias
- **Medical** - Clínicas/Consultorios
- **Automotive** - Talleres mecánicos
- **Fitness** - Gimnasios
- **Restaurant** - Restaurantes
- **Education** - Escuelas/Academias

Cada template trae campos personalizados específicos en formato JSON.

## 📊 Modelos Principales

### Contact (Contacto/Cliente)
- Información básica
- Ubicación
- Template de industria
- Campos personalizados (JSON)
- Tags

### Deal (Oportunidad de Venta)
- Título y descripción
- Valor y moneda
- Etapa en el pipeline
- Fecha estimada de cierre
- Relación con contacto

### Task (Tarea)
- Título y descripción
- Estado y prioridad
- Fecha de vencimiento
- Asignación a usuario
- Relación con contacto/deal

## 🔐 Autenticación

El sistema usa JWT con cookies HttpOnly:
- Token expira en 30 minutos (configurable)
- Cookie segura en producción
- Refresh automático

## 🚧 Próximas Funcionalidades

- [ ] Notas y comentarios
- [ ] Sistema de calendario integrado
- [ ] Reportes avanzados
- [ ] Notificaciones en tiempo real
- [ ] Integración con email
- [ ] API pública para integraciones
- [ ] App móvil

## 📝 Licencia

MIT

## 👨‍💻 Autor

Desarrollado para Zypher

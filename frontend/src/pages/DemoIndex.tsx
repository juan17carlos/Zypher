// frontend/src/pages/DemoIndex.tsx
// Página índice para ver todos los demos y diseños

import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Palette,
  Layout,
  Columns,
  FormInput,
  ArrowRight,
  Briefcase,
  Users,
  CheckSquare,
} from 'lucide-react'

interface DemoCard {
  title: string
  description: string
  path: string
  icon: any
  color: string
}

const demos: DemoCard[] = [
  {
    title: 'Design Showcase',
    description: 'Todos los componentes UI profesionales: Cards, Buttons, Modals, etc.',
    path: '/design-showcase',
    icon: Palette,
    color: 'from-purple-500 to-pink-500',
  },
  {
    title: 'Bitrix24 Replica',
    description: 'Réplica exacta del diseño de Bitrix24 con Timeline y actividades',
    path: '/bitrix24-replica',
    icon: Layout,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Kanban Demo',
    description: 'Tablero Kanban con drag & drop como Bitrix24',
    path: '/kanban-demo',
    icon: Columns,
    color: 'from-green-500 to-teal-500',
  },
  {
    title: 'Form Components',
    description: 'Dropdowns, Date Pickers y componentes de formulario profesionales',
    path: '/form-components',
    icon: FormInput,
    color: 'from-orange-500 to-red-500',
  },
]

const appPages: DemoCard[] = [
  {
    title: 'Deals / Pipeline',
    description: 'Vista Kanban real con tus deals y drag & drop funcional',
    path: '/deals',
    icon: Briefcase,
    color: 'from-indigo-500 to-purple-500',
  },
  {
    title: 'Contactos',
    description: 'Gestión de contactos con modal profesional',
    path: '/contacts',
    icon: Users,
    color: 'from-blue-500 to-indigo-500',
  },
  {
    title: 'Tareas',
    description: 'Sistema de tareas con estados y prioridades',
    path: '/tasks',
    icon: CheckSquare,
    color: 'from-green-500 to-emerald-500',
  },
]

export default function DemoIndex() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Zypher CRM - Design System
          </h1>
          <p className="text-xl text-gray-600">
            Explora todos los componentes y diseños profesionales estilo Bitrix24
          </p>
        </motion.div>

        {/* Aplicación Real */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="w-2 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></div>
            Aplicación CRM (Producción)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {appPages.map((page, index) => (
              <motion.div
                key={page.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
              >
                <Link to={page.path}>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-8 border border-gray-200 group"
                  >
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${page.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                    >
                      <page.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                      {page.title}
                    </h3>
                    <p className="text-gray-600 mb-6">{page.description}</p>
                    <div className="flex items-center gap-2 text-indigo-600 font-medium">
                      Ver página
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Demos de Componentes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
            Componentes de Demostración
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {demos.map((demo, index) => (
              <motion.div
                key={demo.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Link to={demo.path}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6 border border-gray-200 group"
                  >
                    <div
                      className={`w-14 h-14 bg-gradient-to-br ${demo.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <demo.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                      {demo.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">{demo.description}</p>
                    <div className="flex items-center gap-2 text-indigo-600 font-medium text-sm">
                      Explorar
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Info adicional */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="inline-block bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <p className="text-gray-600">
              💡 <strong>Tip:</strong> Las páginas de la aplicación CRM (Deals, Contactos, Tareas)
              requieren autenticación. Los demos son de acceso público.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

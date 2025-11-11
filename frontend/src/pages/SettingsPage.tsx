// frontend/src/pages/SettingsPage.tsx - Página de configuración

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  User,
  Bell,
  Lock,
  Palette,
  Globe,
  Shield,
  Save,
  Check,
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'

export default function SettingsPage() {
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState('profile')
  const [saved, setSaved] = useState(false)

  const [settings, setSettings] = useState({
    // Profile
    fullName: user?.full_name || '',
    email: user?.email || '',
    phone: '',

    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    taskReminders: true,
    dealUpdates: true,

    // Appearance
    theme: 'dark',
    language: 'es',
    compactView: false,

    // Privacy
    profileVisibility: 'team',
    activityLog: true,
  })

  const handleSave = () => {
    // Save settings logic here
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'appearance', label: 'Apariencia', icon: Palette },
    { id: 'privacy', label: 'Privacidad', icon: Shield },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Configuración</h1>
        <p className="text-gray-600 dark:text-dark-300 mt-2">
          Personaliza tu experiencia en Zypher CRM
        </p>
      </div>

      {/* Tabs & Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-600 p-2 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md'
                      : 'text-gray-700 dark:text-dark-200 hover:bg-gray-50 dark:hover:bg-dark-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-600 p-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Información Personal
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-dark-200 mb-2">
                        Nombre Completo
                      </label>
                      <input
                        type="text"
                        value={settings.fullName}
                        onChange={(e) => setSettings({ ...settings, fullName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-dark-900 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-dark-200 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={settings.email}
                        onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-dark-900 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-dark-200 mb-2">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        value={settings.phone}
                        onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                        placeholder="+593 999 999 999"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-dark-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-dark-400"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Preferencias de Notificaciones
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-900 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Notificaciones por Email
                        </p>
                        <p className="text-sm text-gray-600 dark:text-dark-300">
                          Recibe actualizaciones por correo electrónico
                        </p>
                      </div>
                      <label className="relative inline-block w-12 h-6">
                        <input
                          type="checkbox"
                          checked={settings.emailNotifications}
                          onChange={(e) =>
                            setSettings({ ...settings, emailNotifications: e.target.checked })
                          }
                          className="sr-only peer"
                        />
                        <span className="absolute inset-0 bg-gray-300 dark:bg-dark-600 rounded-full peer-checked:bg-purple-600 transition-colors cursor-pointer"></span>
                        <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></span>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-900 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Notificaciones Push
                        </p>
                        <p className="text-sm text-gray-600 dark:text-dark-300">
                          Recibe notificaciones en tiempo real
                        </p>
                      </div>
                      <label className="relative inline-block w-12 h-6">
                        <input
                          type="checkbox"
                          checked={settings.pushNotifications}
                          onChange={(e) =>
                            setSettings({ ...settings, pushNotifications: e.target.checked })
                          }
                          className="sr-only peer"
                        />
                        <span className="absolute inset-0 bg-gray-300 dark:bg-dark-600 rounded-full peer-checked:bg-purple-600 transition-colors cursor-pointer"></span>
                        <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></span>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-900 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Recordatorios de Tareas
                        </p>
                        <p className="text-sm text-gray-600 dark:text-dark-300">
                          Alertas de tareas vencidas o próximas
                        </p>
                      </div>
                      <label className="relative inline-block w-12 h-6">
                        <input
                          type="checkbox"
                          checked={settings.taskReminders}
                          onChange={(e) =>
                            setSettings({ ...settings, taskReminders: e.target.checked })
                          }
                          className="sr-only peer"
                        />
                        <span className="absolute inset-0 bg-gray-300 dark:bg-dark-600 rounded-full peer-checked:bg-purple-600 transition-colors cursor-pointer"></span>
                        <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></span>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-900 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Actualizaciones de Deals
                        </p>
                        <p className="text-sm text-gray-600 dark:text-dark-300">
                          Cambios en el estado de tus deals
                        </p>
                      </div>
                      <label className="relative inline-block w-12 h-6">
                        <input
                          type="checkbox"
                          checked={settings.dealUpdates}
                          onChange={(e) =>
                            setSettings({ ...settings, dealUpdates: e.target.checked })
                          }
                          className="sr-only peer"
                        />
                        <span className="absolute inset-0 bg-gray-300 dark:bg-dark-600 rounded-full peer-checked:bg-purple-600 transition-colors cursor-pointer"></span>
                        <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Personalizar Apariencia
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-dark-200 mb-2">
                        Tema
                      </label>
                      <select
                        value={settings.theme}
                        onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-dark-900 text-gray-900 dark:text-white"
                      >
                        <option value="light">Claro</option>
                        <option value="dark">Oscuro</option>
                        <option value="system">Sistema</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-dark-200 mb-2">
                        Idioma
                      </label>
                      <select
                        value={settings.language}
                        onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-dark-900 text-gray-900 dark:text-white"
                      >
                        <option value="es">Español</option>
                        <option value="en">English</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-900 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Vista Compacta</p>
                        <p className="text-sm text-gray-600 dark:text-dark-300">
                          Reduce el espaciado entre elementos
                        </p>
                      </div>
                      <label className="relative inline-block w-12 h-6">
                        <input
                          type="checkbox"
                          checked={settings.compactView}
                          onChange={(e) =>
                            setSettings({ ...settings, compactView: e.target.checked })
                          }
                          className="sr-only peer"
                        />
                        <span className="absolute inset-0 bg-gray-300 dark:bg-dark-600 rounded-full peer-checked:bg-purple-600 transition-colors cursor-pointer"></span>
                        <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Privacidad y Seguridad
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-dark-200 mb-2">
                        Visibilidad del Perfil
                      </label>
                      <select
                        value={settings.profileVisibility}
                        onChange={(e) =>
                          setSettings({ ...settings, profileVisibility: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-dark-900 text-gray-900 dark:text-white"
                      >
                        <option value="public">Público</option>
                        <option value="team">Solo mi equipo</option>
                        <option value="private">Privado</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-900 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Registro de Actividad
                        </p>
                        <p className="text-sm text-gray-600 dark:text-dark-300">
                          Guarda un historial de tus acciones
                        </p>
                      </div>
                      <label className="relative inline-block w-12 h-6">
                        <input
                          type="checkbox"
                          checked={settings.activityLog}
                          onChange={(e) =>
                            setSettings({ ...settings, activityLog: e.target.checked })
                          }
                          className="sr-only peer"
                        />
                        <span className="absolute inset-0 bg-gray-300 dark:bg-dark-600 rounded-full peer-checked:bg-purple-600 transition-colors cursor-pointer"></span>
                        <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></span>
                      </label>
                    </div>

                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/50 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                        <div>
                          <p className="font-medium text-blue-900 dark:text-blue-100">
                            Tu información está segura
                          </p>
                          <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                            Todos tus datos están encriptados y protegidos según los estándares de la industria.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Save Button */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-dark-600">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg font-medium"
            >
              {saved ? (
                <>
                  <Check className="w-5 h-5" />
                  Guardado
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Guardar Cambios
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}

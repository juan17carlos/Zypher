// frontend/src/components/deals/QuotationPreview.tsx
// Vista previa de cotización generada desde un Deal

import { motion } from 'framer-motion'
import {
  FileText,
  Download,
  Mail,
  Printer,
  X,
  Calendar,
  User,
  Phone,
  MapPin,
  Building2,
} from 'lucide-react'
import type { DealProduct } from '@/types/product'
import { calculateQuotationTotals } from '@/types/product'

interface QuotationPreviewProps {
  isOpen: boolean
  onClose: () => void
  dealTitle: string
  contactName?: string
  contactEmail?: string
  contactPhone?: string
  contactCompany?: string
  products: DealProduct[]
  validDays?: number // Días de validez de la cotización (default 15)
  notes?: string
}

export default function QuotationPreview({
  isOpen,
  onClose,
  dealTitle,
  contactName = 'Cliente',
  contactEmail,
  contactPhone,
  contactCompany,
  products,
  validDays = 15,
  notes,
}: QuotationPreviewProps) {
  if (!isOpen) return null

  const totals = calculateQuotationTotals(products)
  const currentDate = new Date()
  const validUntilDate = new Date(currentDate)
  validUntilDate.setDate(validUntilDate.getDate() + validDays)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-EC', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // TODO: Estas funciones se conectarán con APIs reales cuando el backend esté listo
  const handleDownloadPDF = () => {
    console.log('📄 TODO: Generar PDF de cotización')
    // Aquí se llamará a la API para generar el PDF
    alert('Función en desarrollo: Generación de PDF de cotización')
  }

  const handleSendEmail = () => {
    console.log('📧 TODO: Enviar cotización por email')
    // Aquí se llamará a la API para enviar por email
    alert('Función en desarrollo: Envío de cotización por email')
  }

  const handlePrint = () => {
    console.log('🖨️ TODO: Imprimir cotización')
    window.print()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-dark-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col my-auto"
      >
        {/* Header con acciones */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-700 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Vista Previa de Cotización
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                {dealTitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              title="Descargar PDF"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={handleSendEmail}
              className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
              title="Enviar por Email"
            >
              <Mail className="w-5 h-5" />
            </button>
            <button
              onClick={handlePrint}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-700 rounded-lg transition-colors"
              title="Imprimir"
            >
              <Printer className="w-5 h-5" />
            </button>
            <div className="w-px h-6 bg-gray-300 dark:bg-dark-600 mx-2"></div>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenido de la cotización (formato A4 simulado) */}
        <div className="flex-1 overflow-y-auto bg-gray-100 dark:bg-dark-900 p-6">
          <div
            className="bg-white dark:bg-dark-800 mx-auto shadow-lg"
            style={{ width: '210mm', minHeight: '297mm', padding: '20mm' }}
          >
            {/* Header del documento */}
            <div className="flex items-start justify-between mb-8 pb-6 border-b-2 border-purple-600">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl">Z</span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Zypher CRM
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Sistema de Gestión Comercial
                    </p>
                  </div>
                </div>
                {/* Datos de la empresa (mock) */}
                <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1 mt-3">
                  <p>📍 Quito, Ecuador</p>
                  <p>📞 +593 99 XXX XXXX</p>
                  <p>📧 ventas@zypher-crm.com</p>
                </div>
              </div>

              <div className="text-right">
                <div className="inline-block bg-purple-100 dark:bg-purple-900/30 px-4 py-2 rounded-lg mb-3">
                  <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                    COTIZACIÓN
                  </h2>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <p>
                    <span className="font-semibold">Fecha:</span> {formatDate(currentDate)}
                  </p>
                  <p>
                    <span className="font-semibold">Válida hasta:</span>{' '}
                    {formatDate(validUntilDate)}
                  </p>
                  <p>
                    <span className="font-semibold">Ref:</span> {dealTitle.substring(0, 20)}
                  </p>
                </div>
              </div>
            </div>

            {/* Información del cliente */}
            <div className="mb-8 bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                Cliente
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-xs">Nombre:</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{contactName}</p>
                </div>
                {contactCompany && (
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-xs">Empresa:</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {contactCompany}
                    </p>
                  </div>
                )}
                {contactEmail && (
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-xs">Email:</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {contactEmail}
                    </p>
                  </div>
                )}
                {contactPhone && (
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-xs">Teléfono:</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {contactPhone}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Tabla de productos */}
            <div className="mb-8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                    <th className="text-left p-3 font-semibold">#</th>
                    <th className="text-left p-3 font-semibold">Descripción</th>
                    <th className="text-center p-3 font-semibold">Cant.</th>
                    <th className="text-right p-3 font-semibold">P. Unit.</th>
                    <th className="text-right p-3 font-semibold">Desc.</th>
                    <th className="text-right p-3 font-semibold">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-200 dark:border-dark-600 hover:bg-purple-50 dark:hover:bg-purple-900/10"
                    >
                      <td className="p-3 text-gray-600 dark:text-gray-400">{index + 1}</td>
                      <td className="p-3">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {item.product.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {item.product.code}
                        </div>
                      </td>
                      <td className="p-3 text-center text-gray-900 dark:text-white">
                        {item.quantity} {item.product.unit}
                      </td>
                      <td className="p-3 text-right text-gray-900 dark:text-white">
                        ${item.unit_price.toFixed(2)}
                      </td>
                      <td className="p-3 text-right text-gray-600 dark:text-gray-400">
                        {item.discount_percent ? `${item.discount_percent}%` : '-'}
                      </td>
                      <td className="p-3 text-right font-semibold text-gray-900 dark:text-white">
                        ${item.subtotal.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totales */}
            <div className="flex justify-end mb-8">
              <div className="w-80 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ${totals.subtotal.toFixed(2)}
                  </span>
                </div>

                {totals.total_discount > 0 && (
                  <div className="flex justify-between text-red-600 dark:text-red-400">
                    <span>Descuentos:</span>
                    <span>-${totals.total_discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">IVA (15%):</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ${totals.total_tax.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between pt-3 border-t-2 border-purple-600">
                  <span className="font-bold text-lg text-gray-900 dark:text-white">
                    TOTAL:
                  </span>
                  <span className="font-bold text-xl text-purple-700 dark:text-purple-300">
                    ${totals.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Notas */}
            {notes && (
              <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
                  Notas:
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">{notes}</p>
              </div>
            )}

            {/* Términos y condiciones */}
            <div className="border-t border-gray-300 dark:border-dark-600 pt-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">
                Términos y Condiciones:
              </h4>
              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1.5 list-disc list-inside">
                <li>Esta cotización es válida por {validDays} días calendario.</li>
                <li>Los precios incluyen IVA del 15%.</li>
                <li>
                  Los precios pueden variar si existe cambio en los costos de los productos.
                </li>
                <li>Formas de pago: Efectivo, transferencia bancaria o tarjeta de crédito.</li>
                <li>Tiempo de entrega: A coordinar con el cliente.</li>
              </ul>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-dark-600 pt-4">
              <p>Gracias por su preferencia</p>
              <p className="mt-1">
                Este es un documento generado automáticamente por Zypher CRM
              </p>
            </div>
          </div>
        </div>

        {/* Footer con nota de desarrollo */}
        <div className="p-4 bg-gray-50 dark:bg-dark-700 border-t border-gray-200 dark:border-dark-700">
          <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
            💡 <strong>Modo de desarrollo:</strong> Las funciones de descarga PDF y envío por
            email se activarán cuando se conecten con el backend.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

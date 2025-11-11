// frontend/src/components/deals/DealProductsSection.tsx
// Sección para agregar productos a un Deal (para cotizaciones)

import { useState, useMemo } from 'react'
import {
  Package,
  Plus,
  Trash2,
  Search,
  ShoppingCart,
  DollarSign,
  Percent,
  Calculator,
  X,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { DealProduct, Product } from '@/types/product'
import { MOCK_PRODUCTS, calculateProductTotals, calculateQuotationTotals } from '@/types/product'

interface DealProductsSectionProps {
  products: DealProduct[]
  onChange: (products: DealProduct[]) => void
}

export default function DealProductsSection({ products, onChange }: DealProductsSectionProps) {
  const [showProductSelector, setShowProductSelector] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [editingProduct, setEditingProduct] = useState<number | null>(null)

  // Filtrar productos disponibles basado en búsqueda
  const availableProducts = useMemo(() => {
    if (!searchQuery) return MOCK_PRODUCTS

    const query = searchQuery.toLowerCase()
    return MOCK_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.code.toLowerCase().includes(query) ||
        p.category?.toLowerCase().includes(query)
    )
  }, [searchQuery])

  // Calcular totales
  const totals = useMemo(() => calculateQuotationTotals(products), [products])

  // Agregar producto al deal
  const handleAddProduct = (product: Product) => {
    const existingIndex = products.findIndex((p) => p.product_id === product.id)

    if (existingIndex >= 0) {
      // Si ya existe, incrementar cantidad
      const updated = [...products]
      const existing = updated[existingIndex]
      const newQuantity = existing.quantity + 1

      const { subtotal, taxAmount, total } = calculateProductTotals(
        newQuantity,
        existing.unit_price,
        product.tax_rate,
        existing.discount_percent,
        existing.discount_amount
      )

      updated[existingIndex] = {
        ...existing,
        quantity: newQuantity,
        subtotal,
        tax_amount: taxAmount,
        total,
      }

      onChange(updated)
    } else {
      // Agregar nuevo producto
      const { subtotal, taxAmount, total } = calculateProductTotals(
        1,
        product.price,
        product.tax_rate || 15
      )

      const newDealProduct: DealProduct = {
        product_id: product.id,
        product,
        quantity: 1,
        unit_price: product.price,
        tax_rate: product.tax_rate || 15,
        subtotal,
        tax_amount: taxAmount,
        total,
      }

      onChange([...products, newDealProduct])
    }

    setShowProductSelector(false)
    setSearchQuery('')
  }

  // Actualizar cantidad
  const handleUpdateQuantity = (index: number, quantity: number) => {
    if (quantity < 1) return

    const updated = [...products]
    const item = updated[index]

    const { subtotal, taxAmount, total } = calculateProductTotals(
      quantity,
      item.unit_price,
      item.tax_rate,
      item.discount_percent,
      item.discount_amount
    )

    updated[index] = {
      ...item,
      quantity,
      subtotal,
      tax_amount: taxAmount,
      total,
    }

    onChange(updated)
  }

  // Actualizar precio unitario
  const handleUpdatePrice = (index: number, unitPrice: number) => {
    if (unitPrice < 0) return

    const updated = [...products]
    const item = updated[index]

    const { subtotal, taxAmount, total } = calculateProductTotals(
      item.quantity,
      unitPrice,
      item.tax_rate,
      item.discount_percent,
      item.discount_amount
    )

    updated[index] = {
      ...item,
      unit_price: unitPrice,
      subtotal,
      tax_amount: taxAmount,
      total,
    }

    onChange(updated)
  }

  // Actualizar descuento porcentual
  const handleUpdateDiscount = (index: number, discountPercent: number) => {
    if (discountPercent < 0 || discountPercent > 100) return

    const updated = [...products]
    const item = updated[index]

    const { subtotal, taxAmount, total } = calculateProductTotals(
      item.quantity,
      item.unit_price,
      item.tax_rate,
      discountPercent,
      0 // Reset discount amount cuando se usa descuento porcentual
    )

    updated[index] = {
      ...item,
      discount_percent: discountPercent,
      discount_amount: 0,
      subtotal,
      tax_amount: taxAmount,
      total,
    }

    onChange(updated)
  }

  // Eliminar producto
  const handleRemoveProduct = (index: number) => {
    const updated = products.filter((_, i) => i !== index)
    onChange(updated)
  }

  return (
    <div className="space-y-4">
      {/* Header con botón agregar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Productos agregados: {products.length}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setShowProductSelector(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Agregar Producto
        </button>
      </div>

      {/* Lista de productos agregados */}
      {products.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-dark-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-dark-600">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No hay productos agregados
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
            Haz clic en "Agregar Producto" para empezar
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((item, index) => (
            <div
              key={`${item.product_id}-${index}`}
              className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4 border border-gray-200 dark:border-dark-600 hover:border-purple-300 dark:hover:border-purple-600 transition-all"
            >
              {/* Cabecera del producto */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {item.product.name}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Código: {item.product.code} • {item.product.category}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveProduct(index)}
                  className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Inputs de cantidad y precio */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {/* Cantidad */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Cantidad
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleUpdateQuantity(index, Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                    {item.product.unit}
                  </span>
                </div>

                {/* Precio Unitario */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Precio Unit.
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">
                      $
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unit_price}
                      onChange={(e) => handleUpdatePrice(index, Number(e.target.value))}
                      className="w-full pl-7 pr-3 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>

                {/* Descuento % */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Desc. %
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      value={item.discount_percent || 0}
                      onChange={(e) => handleUpdateDiscount(index, Number(e.target.value))}
                      className="w-full pr-7 pl-3 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">
                      %
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Total
                  </label>
                  <div className="px-3 py-2 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg text-sm font-semibold text-purple-700 dark:text-purple-300">
                    ${item.total.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Detalle de cálculo */}
              <div className="mt-2 pt-2 border-t border-gray-200 dark:border-dark-600 text-xs text-gray-600 dark:text-gray-400">
                Subtotal: ${item.subtotal.toFixed(2)} + IVA ({item.tax_rate}%): $
                {item.tax_amount.toFixed(2)} = Total: ${item.total.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resumen de totales */}
      {products.length > 0 && (
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-2 mb-3">
            <Calculator className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h4 className="font-semibold text-gray-900 dark:text-white">Resumen</h4>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-700 dark:text-gray-300">
                Items: {totals.items_count} ({totals.total_quantity} unidades)
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-700 dark:text-gray-300">Subtotal:</span>
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
              <span className="text-gray-700 dark:text-gray-300">IVA (15%):</span>
              <span className="font-medium text-gray-900 dark:text-white">
                ${totals.total_tax.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between pt-2 border-t border-purple-200 dark:border-purple-800">
              <span className="font-bold text-gray-900 dark:text-white text-base">TOTAL:</span>
              <span className="font-bold text-purple-700 dark:text-purple-300 text-lg">
                ${totals.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Modal selector de productos */}
      <AnimatePresence>
        {showProductSelector && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-dark-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-700 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Package className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Catálogo de Productos
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setShowProductSelector(false)
                    setSearchQuery('')
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {/* Search */}
              <div className="p-4 border-b border-gray-200 dark:border-dark-700">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar por nombre, código o categoría..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    autoFocus
                  />
                </div>
              </div>

              {/* Lista de productos */}
              <div className="overflow-y-auto max-h-[50vh] p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {availableProducts.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleAddProduct(product)}
                      className="text-left p-4 bg-gray-50 dark:bg-dark-700 rounded-lg border border-gray-200 dark:border-dark-600 hover:border-purple-400 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-all group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-300">
                            {product.name}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {product.code} • {product.category}
                          </p>
                        </div>
                        <div className="text-right ml-3">
                          <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                            ${product.price}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            por {product.unit}
                          </div>
                        </div>
                      </div>

                      {product.stock !== undefined && (
                        <div className="flex items-center gap-2 text-xs">
                          <span
                            className={
                              product.stock > 10
                                ? 'text-green-600 dark:text-green-400'
                                : product.stock > 0
                                ? 'text-yellow-600 dark:text-yellow-400'
                                : 'text-red-600 dark:text-red-400'
                            }
                          >
                            Stock: {product.stock} {product.unit}
                          </span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {availableProducts.length === 0 && (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">
                      No se encontraron productos
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

// frontend/src/types/product.ts
// Tipos para productos e items de cotización/facturación

/**
 * Producto del inventario/catálogo
 */
export interface Product {
  id: number
  code: string // Código SKU/interno
  name: string
  description?: string
  category?: string
  unit: string // ej: "unidad", "saco", "m³", "kg"
  price: number // Precio unitario
  cost?: number // Costo (para calcular rentabilidad)
  stock?: number // Stock disponible
  tax_rate?: number // Tasa de impuesto (ej: 15 para 15% IVA)
  is_active: boolean
  created_at?: string
  updated_at?: string
}

/**
 * Item de producto agregado a un Deal (para cotización)
 * Representa la relación muchos-a-muchos entre Deal y Product
 */
export interface DealProduct {
  id?: number // ID del registro de la relación (opcional, solo cuando viene del backend)
  product_id: number
  product: Product // Información completa del producto
  quantity: number
  unit_price: number // Precio unitario (puede ser diferente del precio del catálogo si hay descuento)
  discount_percent?: number // Descuento porcentual aplicado (ej: 5 para 5%)
  discount_amount?: number // Descuento en monto fijo
  tax_rate: number // Tasa de impuesto (normalmente 15% en Ecuador)
  subtotal: number // quantity * unit_price - discount
  tax_amount: number // subtotal * (tax_rate / 100)
  total: number // subtotal + tax_amount
  notes?: string // Notas específicas para este item
}

/**
 * Datos para crear un DealProduct
 */
export interface DealProductCreate {
  product_id: number
  quantity: number
  unit_price?: number // Opcional, se toma del producto si no se especifica
  discount_percent?: number
  discount_amount?: number
  notes?: string
}

/**
 * Resumen de totales de una cotización
 */
export interface QuotationTotals {
  subtotal: number // Suma de todos los subtotales sin impuestos
  total_discount: number // Total de descuentos aplicados
  total_tax: number // Total de impuestos (IVA)
  total: number // Total final a pagar
  items_count: number // Cantidad de productos diferentes
  total_quantity: number // Cantidad total de unidades
}

/**
 * Datos completos de una cotización
 */
export interface Quotation {
  deal_id: number
  deal_title: string
  contact_name: string
  contact_email?: string
  contact_phone?: string
  products: DealProduct[]
  totals: QuotationTotals
  notes?: string
  valid_until?: string // Fecha de validez de la cotización
  created_at: string
  created_by: string
}

// ============================================
// MOCK DATA - Para desarrollo y testing
// ============================================

/**
 * Productos de ejemplo para una ferretería
 * Basados en el caso de uso CASOS_DE_USO_CRM.md
 */
export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    code: 'CEM-CHIMB-50',
    name: 'Cemento Chimborazo 50kg',
    description: 'Cemento gris uso general',
    category: 'Cementos',
    unit: 'saco',
    price: 8.50,
    cost: 7.20,
    stock: 500,
    tax_rate: 15,
    is_active: true,
  },
  {
    id: 2,
    code: 'VAR-12MM-6M',
    name: 'Varilla 12mm (6m)',
    description: 'Varilla de hierro corrugado 12mm longitud 6 metros',
    category: 'Hierro',
    unit: 'unidad',
    price: 9.20,
    cost: 7.80,
    stock: 300,
    tax_rate: 15,
    is_active: true,
  },
  {
    id: 3,
    code: 'ARE-LAV-M3',
    name: 'Arena lavada (m³)',
    description: 'Arena lavada para construcción',
    category: 'Áridos',
    unit: 'm³',
    price: 22.00,
    cost: 16.00,
    stock: 50,
    tax_rate: 15,
    is_active: true,
  },
  {
    id: 4,
    code: 'BLQ-20X20X40',
    name: 'Bloque 20x20x40cm',
    description: 'Bloque de hormigón para mampostería',
    category: 'Bloques',
    unit: 'unidad',
    price: 0.45,
    cost: 0.30,
    stock: 5000,
    tax_rate: 15,
    is_active: true,
  },
  {
    id: 5,
    code: 'VAR-18MM-6M',
    name: 'Varilla 18mm (6m)',
    description: 'Varilla de hierro corrugado 18mm longitud 6 metros',
    category: 'Hierro',
    unit: 'unidad',
    price: 18.50,
    cost: 15.20,
    stock: 150,
    tax_rate: 15,
    is_active: true,
  },
  {
    id: 6,
    code: 'RIP-M3',
    name: 'Ripio (m³)',
    description: 'Ripio triturado para construcción',
    category: 'Áridos',
    unit: 'm³',
    price: 18.00,
    cost: 13.00,
    stock: 40,
    tax_rate: 15,
    is_active: true,
  },
  {
    id: 7,
    code: 'BLQ-10X20X40',
    name: 'Bloque 10x20x40cm',
    description: 'Bloque liviano para paredes divisorias',
    category: 'Bloques',
    unit: 'unidad',
    price: 0.35,
    cost: 0.22,
    stock: 3000,
    tax_rate: 15,
    is_active: true,
  },
  {
    id: 8,
    code: 'CER-PISO-60X60',
    name: 'Piso cerámico 60x60 Graiman',
    description: 'Cerámica para piso acabado mate',
    category: 'Cerámicas',
    unit: 'm²',
    price: 45.00,
    cost: 32.00,
    stock: 200,
    tax_rate: 15,
    is_active: true,
  },
  {
    id: 9,
    code: 'PEG-CER-25KG',
    name: 'Pegamento para cerámica 25kg',
    description: 'Adhesivo cerámico uso interior/exterior',
    category: 'Pegamentos',
    unit: 'saco',
    price: 12.00,
    cost: 8.50,
    stock: 80,
    tax_rate: 15,
    is_active: true,
  },
  {
    id: 10,
    code: 'FRA-GRIS-5KG',
    name: 'Fragüe gris 5kg',
    description: 'Fragüe para juntas de cerámica color gris',
    category: 'Acabados',
    unit: 'kg',
    price: 8.00,
    cost: 5.50,
    stock: 50,
    tax_rate: 15,
    is_active: true,
  },
  {
    id: 11,
    code: 'ARE-FINA-M3',
    name: 'Arena fina (m³)',
    description: 'Arena fina para enlucidos',
    category: 'Áridos',
    unit: 'm³',
    price: 25.00,
    cost: 18.00,
    stock: 30,
    tax_rate: 15,
    is_active: true,
  },
  {
    id: 12,
    code: 'ALA-GAL-KG',
    name: 'Alambre galvanizado',
    description: 'Alambre galvanizado calibre 18',
    category: 'Hierro',
    unit: 'kg',
    price: 2.80,
    cost: 2.00,
    stock: 200,
    tax_rate: 15,
    is_active: true,
  },
]

/**
 * Helper function para calcular totales de un producto
 */
export function calculateProductTotals(
  quantity: number,
  unitPrice: number,
  taxRate: number = 15,
  discountPercent: number = 0,
  discountAmount: number = 0
): { subtotal: number; taxAmount: number; total: number } {
  const baseAmount = quantity * unitPrice

  // Calcular descuento
  const percentDiscount = (baseAmount * discountPercent) / 100
  const totalDiscount = percentDiscount + discountAmount

  const subtotal = baseAmount - totalDiscount
  const taxAmount = (subtotal * taxRate) / 100
  const total = subtotal + taxAmount

  return {
    subtotal: Number(subtotal.toFixed(2)),
    taxAmount: Number(taxAmount.toFixed(2)),
    total: Number(total.toFixed(2)),
  }
}

/**
 * Helper function para calcular totales de una cotización completa
 */
export function calculateQuotationTotals(products: DealProduct[]): QuotationTotals {
  const subtotal = products.reduce((sum, p) => sum + p.subtotal, 0)
  const totalTax = products.reduce((sum, p) => sum + p.tax_amount, 0)
  const total = products.reduce((sum, p) => sum + p.total, 0)
  const itemsCount = products.length
  const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0)

  const totalDiscount = products.reduce((sum, p) => {
    const baseAmount = p.quantity * p.unit_price
    return sum + (baseAmount - p.subtotal)
  }, 0)

  return {
    subtotal: Number(subtotal.toFixed(2)),
    total_discount: Number(totalDiscount.toFixed(2)),
    total_tax: Number(totalTax.toFixed(2)),
    total: Number(total.toFixed(2)),
    items_count: itemsCount,
    total_quantity: totalQuantity,
  }
}

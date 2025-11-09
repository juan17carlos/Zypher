// frontend/src/components/ui/IconBadge.tsx
// Badge con icono como Bitrix24 (esos círculos con iconos de colores)

import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'

interface IconBadgeProps {
  icon: LucideIcon
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'orange'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export default function IconBadge({
  icon: Icon,
  variant = 'primary',
  size = 'md',
  className = '',
}: IconBadgeProps) {
  const variants = {
    primary: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    success: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    warning: 'bg-amber-50 text-amber-600 border-amber-100',
    danger: 'bg-rose-50 text-rose-600 border-rose-100',
    info: 'bg-blue-50 text-blue-600 border-blue-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
  }

  const sizes = {
    sm: 'p-1.5',
    md: 'p-2.5',
    lg: 'p-3',
    xl: 'p-4',
  }

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6',
  }

  return (
    <div
      className={`inline-flex items-center justify-center rounded-lg border ${variants[variant]} ${sizes[size]} ${className}`}
    >
      <Icon className={iconSizes[size]} />
    </div>
  )
}

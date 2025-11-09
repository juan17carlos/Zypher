// frontend/src/components/ui/AnimatedButton.tsx
// Botón con efectos como Bitrix24

import { motion, HTMLMotionProps } from 'framer-motion'
import { ReactNode } from 'react'
import { Loader2 } from 'lucide-react'

interface AnimatedButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: ReactNode
}

export default function AnimatedButton({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className = '',
  disabled,
  ...props
}: AnimatedButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow-md',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm hover:shadow-md',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-sm hover:shadow-md',
    ghost: 'text-gray-700 hover:bg-gray-100',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 text-sm rounded-lg',
    lg: 'px-6 py-3 text-base rounded-lg',
  }

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {!loading && icon && icon}
      {children}
    </motion.button>
  )
}

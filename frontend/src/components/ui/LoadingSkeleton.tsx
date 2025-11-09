// frontend/src/components/ui/LoadingSkeleton.tsx
// Skeleton loading como Bitrix24 (placeholder mientras carga)

import { motion } from 'framer-motion'

interface LoadingSkeletonProps {
  type?: 'text' | 'title' | 'card' | 'avatar' | 'button'
  lines?: number
  className?: string
}

export default function LoadingSkeleton({
  type = 'text',
  lines = 1,
  className = '',
}: LoadingSkeletonProps) {
  const shimmer = {
    initial: { backgroundPosition: '200% 0' },
    animate: { backgroundPosition: '-200% 0' },
  }

  const baseStyles =
    'bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-pulse rounded'

  if (type === 'text') {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className={`h-4 ${baseStyles} ${i === lines - 1 ? 'w-2/3' : 'w-full'}`}
          />
        ))}
      </div>
    )
  }

  if (type === 'title') {
    return <div className={`h-8 w-1/3 ${baseStyles} ${className}`} />
  }

  if (type === 'card') {
    return (
      <div className={`p-6 bg-white rounded-xl border border-gray-200 ${className}`}>
        <div className={`h-6 w-1/3 ${baseStyles} mb-4`} />
        <div className="space-y-3">
          <div className={`h-4 w-full ${baseStyles}`} />
          <div className={`h-4 w-5/6 ${baseStyles}`} />
          <div className={`h-4 w-4/6 ${baseStyles}`} />
        </div>
      </div>
    )
  }

  if (type === 'avatar') {
    return <div className={`w-10 h-10 rounded-full ${baseStyles} ${className}`} />
  }

  if (type === 'button') {
    return <div className={`h-10 w-24 ${baseStyles} ${className}`} />
  }

  return null
}

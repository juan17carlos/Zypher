// frontend/src/components/ui/AnimatedCard.tsx
// Tarjeta con animaciones como Bitrix24

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface AnimatedCardProps {
  children: ReactNode
  className?: string
  hoverScale?: boolean
  delay?: number
}

export default function AnimatedCard({
  children,
  className = '',
  hoverScale = true,
  delay = 0,
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay,
        ease: [0.4, 0, 0.2, 1], // Curva de animación suave
      }}
      whileHover={
        hoverScale
          ? {
              scale: 1.02,
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
              transition: { duration: 0.2 },
            }
          : undefined
      }
      className={`bg-white rounded-xl shadow-sm border border-gray-200 transition-all ${className}`}
    >
      {children}
    </motion.div>
  )
}

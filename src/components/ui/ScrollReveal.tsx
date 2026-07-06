'use client'

import { motion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  variants?: Variants
  delay?: number
}

const defaultVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function ScrollReveal({
  children,
  className,
  variants = defaultVariants,
  delay = 0,
}: ScrollRevealProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={{
        hidden: variants.hidden,
        visible: {
          ...(variants.visible as Record<string, unknown>),
          transition: {
            ...((variants.visible as Record<string, unknown>).transition as Record<
              string,
              unknown
            >),
            delay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

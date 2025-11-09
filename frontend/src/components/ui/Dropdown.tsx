// frontend/src/components/ui/Dropdown.tsx
// Dropdown mejorado como Bitrix24 con animaciones

import { Fragment, ReactNode } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

interface DropdownItem {
  label: string
  onClick: () => void
  icon?: ReactNode
  danger?: boolean
  disabled?: boolean
}

interface DropdownProps {
  trigger: ReactNode
  items: DropdownItem[]
  align?: 'left' | 'right'
}

export default function Dropdown({ trigger, items, align = 'left' }: DropdownProps) {
  const alignClasses = align === 'right' ? 'right-0' : 'left-0'

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button as="div" className="cursor-pointer">
        {trigger}
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={`absolute ${alignClasses} mt-2 w-56 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 border border-gray-200`}
        >
          <div className="py-1">
            {items.map((item, index) => (
              <Menu.Item key={index} disabled={item.disabled}>
                {({ active }) => (
                  <motion.button
                    whileHover={{ x: 2 }}
                    onClick={item.onClick}
                    disabled={item.disabled}
                    className={`
                      ${active ? 'bg-gray-50' : ''}
                      ${item.danger ? 'text-rose-600' : 'text-gray-900'}
                      ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                      group flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors
                    `}
                  >
                    {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                    <span>{item.label}</span>
                  </motion.button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

// Componente auxiliar para trigger de dropdown
export function DropdownTrigger({
  children,
  variant = 'default',
}: {
  children: ReactNode
  variant?: 'default' | 'button'
}) {
  if (variant === 'button') {
    return (
      <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
        {children}
        <ChevronDown className="w-4 h-4" />
      </button>
    )
  }

  return <>{children}</>
}

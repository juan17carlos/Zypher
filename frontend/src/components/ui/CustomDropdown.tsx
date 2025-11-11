// frontend/src/components/ui/CustomDropdown.tsx
// Dropdown personalizado estilo Facturación Pro

import { useState, useEffect, useRef } from 'react'
import { ChevronDown, Check } from 'lucide-react'

interface DropdownOption {
  value: string
  label: string
}

interface CustomDropdownProps {
  value: string
  onChange: (value: string) => void
  options: DropdownOption[]
  placeholder?: string
  className?: string
  disabled?: boolean
}

export default function CustomDropdown({
  value,
  onChange,
  options,
  placeholder = 'Seleccionar...',
  className = '',
  disabled = false,
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSelect = (optionValue: string) => {
    if (!disabled) {
      onChange(optionValue)
      setIsOpen(false)
    }
  }

  const selectedOption = options.find((option) => option.value === value)

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full px-3 py-2.5 h-10 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm transition-colors flex items-center justify-between cursor-pointer ${
          disabled
            ? 'bg-gray-100 dark:bg-dark-700 border-gray-200 dark:border-dark-600 cursor-not-allowed text-gray-500 dark:text-dark-400'
            : 'bg-white dark:bg-dark-700 border-gray-300 dark:border-dark-600 hover:border-gray-400 dark:hover:border-dark-500'
        }`}
      >
        <span
          className={
            selectedOption
              ? 'text-gray-900 dark:text-white text-sm'
              : 'text-gray-500 dark:text-gray-400 text-sm'
          }
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 dark:text-gray-400 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-[9999] w-full mt-1 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600 rounded-lg shadow-xl max-h-64 overflow-hidden">
          <div className="sticky top-0 bg-gray-50 dark:bg-dark-700 px-3 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-dark-600">
            {options.length} opciones disponibles
          </div>
          <div
            className="max-h-56 overflow-y-auto scrollbar-thin"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#d1d5db #f3f4f6',
            }}
          >
            <ul className="py-1">
              {options.map((option) => (
                <li
                  key={option.value}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    handleSelect(option.value)
                  }}
                  className="px-3 py-2.5 min-h-[44px] hover:bg-primary-50 dark:hover:bg-dark-700 cursor-pointer text-gray-900 dark:text-white transition-colors duration-150 flex items-center text-sm"
                >
                  <span className="block truncate flex-1">{option.label}</span>
                  {value === option.value && (
                    <Check className="h-4 w-4 text-primary-600 dark:text-primary-400 ml-auto flex-shrink-0" />
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

// frontend/src/components/ui/SelectDropdown.tsx
// Dropdown/Select EXACTO como Bitrix24

import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { Check, ChevronDown, Search } from 'lucide-react'
import { motion } from 'framer-motion'

interface Option {
  value: string
  label: string
  icon?: React.ReactNode
  description?: string
}

interface SelectDropdownProps {
  options: Option[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  searchable?: boolean
  label?: string
  required?: boolean
}

export default function SelectDropdown({
  options,
  value,
  onChange,
  placeholder = 'Seleccionar...',
  searchable = false,
  label,
  required = false,
}: SelectDropdownProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const selectedOption = options.find((opt) => opt.value === value)

  const filteredOptions = searchable
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <Listbox value={value} onChange={onChange}>
        {({ open }) => (
          <div className="relative">
            {/* Button */}
            <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-2.5 pl-4 pr-10 text-left border border-gray-300 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
              <span className="block truncate text-gray-900">
                {selectedOption ? (
                  <span className="flex items-center gap-2">
                    {selectedOption.icon && selectedOption.icon}
                    {selectedOption.label}
                  </span>
                ) : (
                  <span className="text-gray-500">{placeholder}</span>
                )}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <motion.div
                  animate={{ rotate: open ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </motion.div>
              </span>
            </Listbox.Button>

            {/* Dropdown */}
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Listbox.Options className="absolute z-50 mt-2 max-h-80 w-full overflow-auto rounded-lg bg-white py-2 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-200">
                {/* Search input */}
                {searchable && (
                  <div className="px-3 pb-2 border-b border-gray-200">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Buscar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                )}

                {/* Options */}
                <div className="py-1">
                  {filteredOptions.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-gray-500 text-center">
                      No hay resultados
                    </div>
                  ) : (
                    filteredOptions.map((option) => (
                      <Listbox.Option
                        key={option.value}
                        value={option.value}
                        className={({ active }) =>
                          `relative cursor-pointer select-none py-2.5 pl-10 pr-4 transition-colors ${
                            active ? 'bg-blue-50 text-blue-900' : 'text-gray-900'
                          }`
                        }
                      >
                        {({ selected, active }) => (
                          <>
                            <div className="flex items-center gap-2">
                              {option.icon && (
                                <span
                                  className={`flex-shrink-0 ${
                                    selected ? 'text-blue-600' : 'text-gray-400'
                                  }`}
                                >
                                  {option.icon}
                                </span>
                              )}
                              <div className="flex-1">
                                <span
                                  className={`block truncate ${
                                    selected ? 'font-semibold' : 'font-normal'
                                  }`}
                                >
                                  {option.label}
                                </span>
                                {option.description && (
                                  <span className="block text-xs text-gray-500 mt-0.5">
                                    {option.description}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Checkmark */}
                            {selected && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600"
                              >
                                <Check className="h-5 w-5" />
                              </motion.span>
                            )}
                          </>
                        )}
                      </Listbox.Option>
                    ))
                  )}
                </div>
              </Listbox.Options>
            </Transition>
          </div>
        )}
      </Listbox>
    </div>
  )
}

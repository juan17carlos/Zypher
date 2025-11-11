// frontend/src/components/ui/GlobalSearch.tsx - Búsqueda global del CRM

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Users, TrendingUp, CheckSquare, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import contactsService from '@/services/contactsService'
import dealsService from '@/services/dealsService'
import tasksService from '@/services/tasksService'

interface SearchResult {
  id: string | number
  type: 'contact' | 'deal' | 'task'
  title: string
  subtitle?: string
  path: string
}

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Search debounce
  useEffect(() => {
    if (searchQuery.length < 2) {
      setResults([])
      return
    }

    setLoading(true)
    const timeoutId = setTimeout(async () => {
      await performSearch(searchQuery)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K to open search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
        setTimeout(() => inputRef.current?.focus(), 100)
      }
      // Escape to close
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const performSearch = async (query: string) => {
    try {
      const [contactsData, dealsData, tasksData] = await Promise.all([
        contactsService.getAllWithPagination({ search: query, page_size: 3 }),
        dealsService.getAllWithPagination({ search: query, page_size: 3 }),
        tasksService.getAllWithPagination({ search: query, page_size: 3 }),
      ])

      const searchResults: SearchResult[] = []

      // Add contacts
      contactsData.items.forEach((contact) => {
        searchResults.push({
          id: contact.id,
          type: 'contact',
          title: contact.full_name,
          subtitle: contact.company || contact.email || undefined,
          path: `/contacts`,
        })
      })

      // Add deals
      dealsData.items.forEach((deal) => {
        searchResults.push({
          id: deal.id,
          type: 'deal',
          title: deal.title,
          subtitle: deal.contact?.full_name || undefined,
          path: `/deals`,
        })
      })

      // Add tasks
      tasksData.items.forEach((task) => {
        searchResults.push({
          id: task.id,
          type: 'task',
          title: task.title,
          subtitle: task.description || undefined,
          path: `/tasks`,
        })
      })

      setResults(searchResults)
    } catch (error) {
      console.error('Error searching:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleResultClick = (result: SearchResult) => {
    navigate(result.path)
    setIsOpen(false)
    setSearchQuery('')
    setResults([])
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'contact':
        return <Users className="w-4 h-4" />
      case 'deal':
        return <TrendingUp className="w-4 h-4" />
      case 'task':
        return <CheckSquare className="w-4 h-4" />
      default:
        return <Search className="w-4 h-4" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'contact':
        return 'Contacto'
      case 'deal':
        return 'Deal'
      case 'task':
        return 'Tarea'
      default:
        return ''
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'contact':
        return 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30'
      case 'deal':
        return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30'
      case 'task':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30'
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30'
    }
  }

  return (
    <div ref={searchRef} className="relative flex-1 max-w-md">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="Buscar en CRM... (Ctrl+K)"
          className="w-full pl-10 pr-10 py-2 bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('')
              setResults([])
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-dark-600 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {isOpen && (searchQuery.length >= 2 || results.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 w-full bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600 rounded-lg shadow-xl overflow-hidden z-50 max-h-96 overflow-y-auto"
          >
            {loading ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                <p className="mt-2 text-sm text-gray-600 dark:text-dark-300">Buscando...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="py-2">
                {results.map((result, index) => (
                  <button
                    key={`${result.type}-${result.id}-${index}`}
                    onClick={() => handleResultClick(result)}
                    className="w-full px-4 py-3 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors flex items-center gap-3 text-left"
                  >
                    <div className={`p-2 rounded-lg ${getTypeColor(result.type)}`}>
                      {getIcon(result.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900 dark:text-white truncate">
                          {result.title}
                        </p>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-dark-300">
                          {getTypeLabel(result.type)}
                        </span>
                      </div>
                      {result.subtitle && (
                        <p className="text-sm text-gray-500 dark:text-dark-400 truncate">
                          {result.subtitle}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : searchQuery.length >= 2 ? (
              <div className="p-8 text-center">
                <Search className="w-12 h-12 text-gray-300 dark:text-dark-600 mx-auto mb-3" />
                <p className="text-sm text-gray-600 dark:text-dark-300">
                  No se encontraron resultados para "{searchQuery}"
                </p>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

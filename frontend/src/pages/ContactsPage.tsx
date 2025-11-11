// frontend/src/pages/ContactsPage.tsx - Página principal de Contactos

import { useState } from 'react'
import ContactsTableNew from '@/components/contacts/ContactsTableNew'
import ContactModalNew from '@/components/contacts/ContactModalNew'
import type { ContactOut } from '@/types/contact'
import contactService from '@/services/contactsService'

export default function ContactsPage() {
  const [_selectedContact, setSelectedContact] = useState<ContactOut | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<ContactOut | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleCreateClick = () => {
    setEditingContact(null)
    setIsModalOpen(true)
  }

  const handleEditClick = (contact: ContactOut) => {
    setEditingContact(contact)
    setIsModalOpen(true)
  }

  const handleDeleteClick = async (contact: ContactOut) => {
    if (window.confirm(`¿Estás seguro de eliminar el contacto "${contact.full_name}"?`)) {
      try {
        await contactService.delete(contact.id)
        setRefreshKey((prev) => prev + 1) // Trigger reload
        alert('Contacto eliminado exitosamente')
      } catch (err: any) {
        alert(err.message || 'Error eliminando contacto')
      }
    }
  }

  const handleContactClick = (contact: ContactOut) => {
    setSelectedContact(contact)
    // TODO: Abrir vista de detalle en modal o panel lateral
    console.log('Ver detalle:', contact)
  }

  const handleModalSuccess = () => {
    setRefreshKey((prev) => prev + 1) // Trigger reload
  }

  return (
    <div>
      {/* Tabla de Contactos con Stats integrados */}
      <ContactsTableNew
        key={`table-${refreshKey}`}
        onContactClick={handleContactClick}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
        onCreateClick={handleCreateClick}
      />

      {/* Modal Crear/Editar */}
      <ContactModalNew
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
        contact={editingContact}
      />
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Loader2, Mail, X } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

interface Author {
  name: string
  email: string
  avatar?: string
  slug: string
}

interface InviteAuthorsProps {
  corpseId: string
}

export default function InviteAuthors({ corpseId }: InviteAuthorsProps) {
  const { data: session } = useSession()
  const [authors, setAuthors] = useState<Author[]>([])
  const [filteredAuthors, setFilteredAuthors] = useState<Author[]>([])
  const [selectedAuthors, setSelectedAuthors] = useState<Author[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  // Load authors from Sanity
  useEffect(() => {
    const loadAuthors = async () => {
      setIsSearching(true)
      try {
        const response = await fetch('/api/authors/search')
        if (response.ok) {
          const data = await response.json()
          setAuthors(data.authors)
          setFilteredAuthors(data.authors)
        }
      } catch (error) {
        console.error('Error loading authors:', error)
      } finally {
        setIsSearching(false)
      }
    }

    loadAuthors()
  }, [])

  // Filter authors based on search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredAuthors(authors)
      return
    }

    const filtered = authors.filter(
      (author) =>
        author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        author.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredAuthors(filtered)
  }, [searchQuery, authors])

  const addAuthor = (author: Author) => {
    if (!selectedAuthors.find((a) => a.email === author.email)) {
      setSelectedAuthors([...selectedAuthors, author])
    }
    setSearchQuery('')
  }

  const removeAuthor = (email: string) => {
    setSelectedAuthors(selectedAuthors.filter((a) => a.email !== email))
  }

  const sendInvitations = async () => {
    if (selectedAuthors.length === 0) return

    setIsLoading(true)
    try {
      const emails = selectedAuthors.map((a) => a.email)
      const response = await fetch(`/api/corpse/${corpseId}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emails }),
      })

      if (response.ok) {
        toast({
          title: 'Invitaciones enviadas',
          description: `Se enviaron ${selectedAuthors.length} invitaciones exitosamente.`,
        })
        setSelectedAuthors([])
      } else {
        const error = await response.json()
        toast({
          title: 'Error al enviar invitaciones',
          description: error.error || 'Ocurrió un error inesperado',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error de conexión',
        description: 'No se pudieron enviar las invitaciones',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!session?.user) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">Debes iniciar sesión para invitar autores.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-lg font-semibold">Invitar Autores</h3>

        {/* Search Input */}
        <div className="relative">
          <Input
            placeholder="Buscar autores por nombre o email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
          {isSearching && (
            <Loader2 className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform animate-spin" />
          )}
        </div>

        {/* Search Results */}
        {searchQuery && (
          <div className="mt-2 max-h-48 overflow-y-auto rounded-md border">
            {filteredAuthors.length === 0 ? (
              <div className="text-muted-foreground p-4 text-center">No se encontraron autores</div>
            ) : (
              filteredAuthors.slice(0, 10).map((author) => (
                <div
                  key={author.email}
                  className="hover:bg-muted cursor-pointer border-b p-3 last:border-b-0"
                  onClick={() => addAuthor(author)}
                >
                  <div className="flex items-center gap-3">
                    {author.avatar && (
                      <img src={author.avatar} alt={author.name} className="h-8 w-8 rounded-full" />
                    )}
                    <div>
                      <p className="font-medium">{author.name}</p>
                      <p className="text-muted-foreground text-sm">{author.email}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Selected Authors */}
        {selectedAuthors.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-sm font-medium">Autores seleccionados:</p>
            <div className="flex flex-wrap gap-2">
              {selectedAuthors.map((author) => (
                <Badge key={author.email} variant="secondary" className="pr-1">
                  <span className="mr-2">{author.name}</span>
                  <button
                    onClick={() => removeAuthor(author.email)}
                    className="hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Send Button */}
        <div className="mt-6">
          <Button
            onClick={sendInvitations}
            disabled={selectedAuthors.length === 0 || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando invitaciones...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Enviar {selectedAuthors.length} invitación{selectedAuthors.length !== 1 ? 'es' : ''}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

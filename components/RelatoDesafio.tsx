import React, { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'

// Componentes personalizados para el PortableText de Sanity
const ptComponents = {
  types: {
    image: ({value}: any) => (
      <img 
        src={value.imageUrl || value.asset?.url} 
        alt={value.alt || ''} 
        className="w-full rounded-lg my-4"
      />
    ),
    callout: ({value}: any) => (
      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg my-4">
        <p className="italic">{value.text}</p>
      </div>
    )
  },
  marks: {
    link: ({value, children}: any) => {
      const target = (value?.href || '').startsWith('http') ? '_blank' : undefined
      return (
        <a href={value?.href} target={target} rel={target === '_blank' ? 'noopener noreferrer' : ''}>
          {children}
        </a>
      )
    }
  }
} as any

type RelatoDesafioProps = {
  relato: any
  onComplete: () => void
  esUltimoRelato?: boolean
  permitirRetroceder?: boolean
  onRetroceder?: () => void
}

export default function RelatoDesafio({ 
  relato, 
  onComplete, 
  esUltimoRelato = false,
  permitirRetroceder = false,
  onRetroceder
}: RelatoDesafioProps) {
  // Efecto para hacer scroll al inicio cuando el componente se monta
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">{relato.title}</h2>
        <div className="flex items-center">
          {relato.author.avatar && (
            <Image
              src={relato.author.avatar}
              alt={relato.author.name}
              width={40}
              height={40}
              className="rounded-full mr-3"
            />
          )}
          <span>
            Por{' '}
            <Link href={`/autor/${relato.author.slug.current}`} className="font-medium hover:underline">
              {relato.author.name}
            </Link>
          </span>
        </div>
      </div>
      
      <div className="prose dark:prose-invert max-w-none">
        <PortableText value={relato.body} components={ptComponents} />
      </div>
      
      <div className="mt-8 flex justify-between">
        {permitirRetroceder && onRetroceder ? (
          <button
            onClick={onRetroceder}
            className="px-6 py-2 rounded-lg font-medium transition-colors bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200"
          >
            Atrás
          </button>
        ) : (
          <div>{/* Espacio vacío para mantener la alineación con justify-between */}</div>
        )}
        
        <button
          onClick={onComplete}
          className="px-6 py-2 rounded-lg font-medium transition-colors bg-black text-[#faff00] hover:bg-gray-900"
        >
          {esUltimoRelato ? 'Ir al desafío' : 'Siguiente'}
        </button>
      </div>
    </div>
  )
} 
import React, { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import { ptComponents } from './PortableTextComponents'

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
  onRetroceder,
}: RelatoDesafioProps) {
  // Efecto para hacer scroll al inicio cuando el componente se monta
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h2 className="mb-2 text-3xl font-bold">{relato.title}</h2>
        <div className="flex items-center">
          {relato.author.avatar && (
            <Image
              src={relato.author.avatar}
              alt={relato.author.name}
              width={40}
              height={40}
              className="mr-3 rounded-full"
            />
          )}
          <span>
            Por{' '}
            <Link
              href={`/autor/${relato.author.slug.current}`}
              className="font-medium hover:underline"
            >
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
            className="rounded-lg bg-gray-200 px-6 py-2 font-medium text-gray-800 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200"
          >
            Atrás
          </button>
        ) : (
          <div>{/* Espacio vacío para mantener la alineación con justify-between */}</div>
        )}

        <button
          onClick={onComplete}
          className="rounded-lg bg-black px-6 py-2 font-medium text-[#faff00] transition-colors hover:bg-gray-900"
        >
          {esUltimoRelato ? 'Ir al desafío' : 'Siguiente'}
        </button>
      </div>
    </div>
  )
}

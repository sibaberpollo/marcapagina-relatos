import CustomTooltip from './CustomTooltip'

// Componentes personalizados para el PortableText de Sanity
export const ptComponents = {
  types: {
    image: ({ value }: any) => (
      <div className="w-full my-4 overflow-hidden rounded-lg">
        <img
          src={value.asset.url}
          alt={value.alt || "Imagen del contenido"}
          className="w-full h-[120px] object-contain object-center"
        />
      </div>
    ),
    callout: ({ value }: any) => (
      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg my-4">
        <p className="italic">{value.text}</p>
      </div>
    ),
    // Manejar bloques de tipo 'span' que aparecen en el contenido de Sanity
    span: ({ value, children }: any) => {
      // Si el span tiene marks, los procesamos
      if (value?.marks?.length > 0) {
        return <span>{children}</span>
      }
      // Si no tiene marks, solo devolvemos el contenido
      return <span>{children}</span>
    }
  },
  marks: {
    link: ({ value, children }: any) => {
      const target = (value?.href || '').startsWith('http') ? '_blank' : undefined
      return (
        <a
          href={value?.href}
          target={target}
          rel={target === '_blank' ? 'noopener noreferrer' : undefined}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
        >
          {children}
        </a>
      )
    },
    tooltip: ({ value, children }: any) => {
      return <CustomTooltip text={String(children)} tooltip={value.tooltipText} />
    },
    strong: ({ children }: any) => <strong>{children}</strong>,
    em: ({ children }: any) => <em>{children}</em>,
    code: ({ children }: any) => (
      <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono">
        {children}
      </code>
    )
  },
  block: {
    // Manejar diferentes tipos de bloques
    normal: ({ children }: any) => <p className="mb-4">{children}</p>,
    h1: ({ children }: any) => <h1 className="text-3xl font-bold mb-4">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-2xl font-bold mb-3">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-xl font-bold mb-2">{children}</h3>,
    h4: ({ children }: any) => <h4 className="text-lg font-bold mb-2">{children}</h4>,
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4 text-gray-600 dark:text-gray-400">
        {children}
      </blockquote>
    )
  },
  list: {
    bullet: ({ children }: any) => <ul className="list-disc list-inside mb-4">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal list-inside mb-4">{children}</ol>
  },
  listItem: {
    bullet: ({ children }: any) => <li className="mb-1">{children}</li>,
    number: ({ children }: any) => <li className="mb-1">{children}</li>
  }
} as any 
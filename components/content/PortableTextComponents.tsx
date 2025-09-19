import CustomTooltip from '../common/CustomTooltip'

// Componentes personalizados para el PortableText de Sanity
export const ptComponents = {
  types: {
    image: ({ value }: any) => (
      <div className="my-4 w-full overflow-hidden rounded-lg">
        <img
          src={value.asset.url}
          alt={value.alt || 'Imagen del contenido'}
          className="h-[120px] w-full object-contain object-center"
        />
      </div>
    ),
    callout: ({ value }: any) => (
      <div className="my-4 rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
        <p className="italic">{value.text}</p>
      </div>
    ),
    // Separador horizontal personalizado
    hr: ({ value }: any) => {
      const style = value?.style || 'normal'

      // Variaciones según el estilo
      const getStrokeWidth = () => {
        switch (style) {
          case 'thick':
            return '2'
          case 'dotted':
            return '1'
          default:
            return '1'
        }
      }

      const getDashArray = () => {
        switch (style) {
          case 'dotted':
            return '1,3'
          case 'thick':
            return 'none'
          default:
            return '2,2'
        }
      }

      const getOpacity = () => {
        switch (style) {
          case 'thick':
            return '0.8'
          default:
            return '0.6'
        }
      }

      return (
        <div className="my-8 flex items-center justify-center">
          <svg
            width="120"
            height="24"
            viewBox="0 0 120 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-gray-400 dark:text-gray-600"
            style={{ opacity: getOpacity() }}
          >
            <g fill="currentColor">
              {/* Flor central */}
              <circle cx="60" cy="12" r={style === 'thick' ? '4' : '3'} />
              <path d="M60 6 L62 9 L65 7 L63 10 L66 12 L63 14 L65 17 L62 15 L60 18 L58 15 L55 17 L57 14 L54 12 L57 10 L55 7 L58 9 Z" />

              {/* Elementos laterales izquierdos */}
              <circle cx="30" cy="12" r={style === 'thick' ? '3' : '2'} />
              <path d="M25 12 L30 10 L35 12 L30 14 Z" />

              {/* Elementos laterales derechos */}
              <circle cx="90" cy="12" r={style === 'thick' ? '3' : '2'} />
              <path d="M85 12 L90 10 L95 12 L90 14 Z" />

              {/* Líneas decorativas */}
              <line
                x1="10"
                y1="12"
                x2="20"
                y2="12"
                stroke="currentColor"
                strokeWidth={getStrokeWidth()}
                strokeDasharray={getDashArray()}
              />
              <line
                x1="100"
                y1="12"
                x2="110"
                y2="12"
                stroke="currentColor"
                strokeWidth={getStrokeWidth()}
                strokeDasharray={getDashArray()}
              />

              {/* Puntos decorativos */}
              <circle cx="15" cy="12" r="1" />
              <circle cx="45" cy="12" r="1" />
              <circle cx="75" cy="12" r="1" />
              <circle cx="105" cy="12" r="1" />
            </g>
          </svg>
        </div>
      )
    },
    // Manejar bloques de tipo 'span' que aparecen en el contenido de Sanity
    span: ({ value, children }: any) => {
      // Si el span tiene marks, los procesamos
      if (value?.marks?.length > 0) {
        return <span>{children}</span>
      }
      // Si no tiene marks, solo devolvemos el contenido
      return <span>{children}</span>
    },
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
      <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm dark:bg-gray-800">
        {children}
      </code>
    ),
  },
  block: {
    // Manejar diferentes tipos de bloques
    normal: ({ children }: any) => <p className="mb-4">{children}</p>,
    h1: ({ children }: any) => <h1 className="mb-4 text-3xl font-bold">{children}</h1>,
    h2: ({ children }: any) => <h2 className="mb-3 text-2xl font-bold">{children}</h2>,
    h3: ({ children }: any) => <h3 className="mb-2 text-xl font-bold">{children}</h3>,
    h4: ({ children }: any) => <h4 className="mb-2 text-lg font-bold">{children}</h4>,
    blockquote: ({ children }: any) => (
      <blockquote className="my-4 border-l-4 border-gray-300 pl-4 text-gray-600 italic dark:text-gray-400">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => <ul className="mb-4 list-inside list-disc">{children}</ul>,
    number: ({ children }: any) => <ol className="mb-4 list-inside list-decimal">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }: any) => <li className="mb-1">{children}</li>,
    number: ({ children }: any) => <li className="mb-1">{children}</li>,
  },
} as any

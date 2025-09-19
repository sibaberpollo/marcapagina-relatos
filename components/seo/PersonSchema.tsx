type PersonSchemaProps = {
  name: string
  url?: string
  image?: string
  sameAs?: string[]
  description?: string
}

export default function PersonSchema({
  name,
  url,
  image,
  sameAs = [],
  description,
}: PersonSchemaProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    ...(url ? { url } : {}),
    ...(image ? { image } : {}),
    ...(description ? { description } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

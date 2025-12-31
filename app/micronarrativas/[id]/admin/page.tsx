import InviteAuthors from '@/components/corpse/InviteAuthors'

interface CorpsePageProps {
  params: Promise<{ id: string }>
}

export default async function CorpsePage({ params }: CorpsePageProps) {
  const { id } = await params

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-3xl font-bold">Administrar Cadáver Exquisito</h1>

        <div className="rounded-lg bg-white p-6 shadow">
          <InviteAuthors corpseId={id} />
        </div>
      </div>
    </div>
  )
}

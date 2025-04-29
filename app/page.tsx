import { getSortedProjects } from '@/data/projectsData'
import Card from '@/components/Card'

export default function Page() {
  // Obtener los proyectos ordenados según la propiedad 'order'
  const sortedProjects = getSortedProjects();

  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-3xl sm:leading-9 md:text-5xl md:leading-12 dark:text-gray-100">
            Relatos
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            Gente que escribe cuando nadie los ve.
          </p>
        </div>
        <div className="container py-12">
          <div className="-m-4 flex flex-wrap">
            {sortedProjects.map((d) => (
              <Card
                key={d.title}
                title={d.title}
                description={d.description}
                imgSrc={d.imgSrc}
                href={d.href}
                authorImgSrc={d.authorImgSrc}
                authorName={d.authorName}
                authorHref={d.authorHref}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

import { getSortedProjects, getFeaturedProject, getNonFeaturedProjects } from '@/data/projectsData'
import Card from '@/components/Card'
import FeaturedCard from '@/components/FeaturedCard'
import siteMetadata from '@/data/siteMetadata';

export default function Page() {
  // Obtener el proyecto destacado
  const featuredProject = getFeaturedProject();
  
  // Obtener los proyectos no destacados ordenados
  const nonFeaturedProjects = getNonFeaturedProjects();

  return (
    <>
      <div >
        <div className="space-y-2 pt-6 pb-4 md:space-y-5">
          <h1 className="text-xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-3xl sm:leading-9 md:text-5xl md:leading-12 dark:text-gray-100">
            Relatos
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            {siteMetadata.descriptionRich}
            <a
              href="/acerca-de/"
              className="ml-2 px-2 py-1 bg-yellow-300 text-gray-900 font-semibold hover:bg-yellow-200 transition-colors duration-200 align-middle"
              style={{ boxShadow: '0 2px 8px 0 rgba(255,255,0,0.3)' }}
            >
              ¿Quieres saber más? <span className="underline">Leer</span>
            </a>
          </p>
        </div>
        
        {/* Relato Destacado */}
        {featuredProject && (
          <div className="container py-4">
            <FeaturedCard
              title={featuredProject.title}
              description={featuredProject.description}
              imgSrc={featuredProject.imgSrc || ''}
              href={featuredProject.href || '#'}
              authorImgSrc={featuredProject.authorImgSrc || ''}
              authorName={featuredProject.authorName || ''}
              authorHref={featuredProject.authorHref || '#'}
            />
          </div>
        )}
        
        {/* Otros Relatos */}
        <div className="container">
          <div className="-m-4 flex flex-wrap">
            {nonFeaturedProjects.map((d) => (
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

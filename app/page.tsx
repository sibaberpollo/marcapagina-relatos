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
            {(() => {
              const desc = siteMetadata.descriptionRich;
              const match = desc.match(/(.*?)(\(2009 ~ 2014 → 2025 ➔ ∞\))/);
              if (match) {
                return <>
                  {match[1]}
                  <a
                    href="/acerca-de/"
                    className="ml-2 px-2 underline font-semibold hover:bg-yellow-200 transition-colors duration-200 align-middle rounded"
                    style={{ 
                      background: 'linear-gradient(90deg, rgba(250,255,0,0.2) 0%, rgba(250,255,0,0.4) 20%, rgba(250,255,0,0.6) 50%, rgba(250,255,0,0.4) 80%, rgba(250,255,0,0.2) 100%)',
                      color: '#222',
                      boxShadow: '0 0 12px rgba(250,255,0,0.2)',
                      clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, 2% 2%, 98% 2%, 98% 98%, 2% 98%, 2% 2%)'
                    }}
                  >
                    {match[2]}
                  </a>
                </>;
              }
              return desc;
            })()}
          </p>
        </div>
        
        {/* Relato Destacado */}
        {featuredProject && (
          <div className="container py-2">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-8">
            {nonFeaturedProjects.map((d) => (
              <FeaturedCard
                key={d.title}
                title={d.title}
                description={d.description}
                imgSrc={d.imgSrc || ''}
                href={d.href || '#'}
                authorImgSrc={d.authorImgSrc || ''}
                authorName={d.authorName || ''}
                authorHref={d.authorHref || '#'}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

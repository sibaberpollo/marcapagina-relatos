import { getFeaturedAndNonFeaturedRelatos } from '../lib/sanity'
// import { getSortedProjects, getFeaturedProject, getNonFeaturedProjects } from '@/data/projectsData'
//import Card from '@/components/Card'
import FeaturedCard from '@/components/FeaturedCard'
import siteMetadata from '@/data/siteMetadata';

// Tipo común para ambos orígenes de datos
interface CardProps {
  title: string;
  description: string;
  imgSrc: string;
  href: string;
  authorImgSrc: string;
  authorName: string;
  authorHref: string;
}

export default async function Page() {
  // Obtener datos desde Sanity
  let featuredProject: CardProps | null = null;
  let nonFeaturedProjects: CardProps[] = [];
  
  try {
    console.log('Obteniendo datos desde Sanity');
    const { featured, nonFeatured } = await getFeaturedAndNonFeaturedRelatos();
    featuredProject = featured;
    nonFeaturedProjects = nonFeatured;
    console.log('Datos obtenidos de Sanity:', { 
      featuredProject: featuredProject?.title, 
      nonFeaturedCount: nonFeaturedProjects.length 
    });
  } catch (error) {
    console.error('Error al obtener datos de Sanity:', error);
  }

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
                const HighlightStroke = require('@/components/HighlightStroke').default;
                return <>
                  {match[1]}
                  <HighlightStroke>
                    <a
                      href="/acerca-de/"
                    >
                      {match[2]}
                    </a>
                  </HighlightStroke>
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
              imgSrc={featuredProject.imgSrc}
              href={featuredProject.href}
              authorImgSrc={featuredProject.authorImgSrc}
              authorName={featuredProject.authorName}
              authorHref={featuredProject.authorHref}
            />
          </div>
        )}
        
        {/* Otros Relatos */}
        {nonFeaturedProjects.length > 0 ? (
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-8">
              {nonFeaturedProjects.map((d) => (
                <FeaturedCard
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
        ) : (
          <div className="container text-center py-8">
            <p className="text-lg text-gray-600">No hay relatos configurados en Sanity</p>
          </div>
        )}
      </div>
    </>
  )
}

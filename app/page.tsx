import { getFeaturedAndNonFeaturedRelatos } from '../lib/sanity'
// import { getSortedProjects, getFeaturedProject, getNonFeaturedProjects } from '@/data/projectsData'
//import Card from '@/components/Card'
import FeaturedCard from '@/components/FeaturedCard'
import siteMetadata from '@/data/siteMetadata';
import SectionContainer from '@/components/SectionContainer'

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
    <SectionContainer>
      <div className="space-y-2 pt-6 pb-4 md:space-y-5">
        <h1 className="text-xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-gray-50 sm:text-3xl sm:leading-9 md:text-5xl md:leading-12">
          Relatos
        </h1>
        <p className="text-lg leading-7 text-gray-700 dark:text-gray-300">
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
                    className="hover:text-gray-800 dark:text-gray-900"
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
      
      {/* Grid de tres cards por fila */}
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {/* Card destacada */}
          {featuredProject && (
            <div className="aspect-[9/16]">
              <FeaturedCard
                title={featuredProject.title}
                description={featuredProject.description}
                imgSrc={featuredProject.imgSrc}
                href={featuredProject.href}
                authorImgSrc={featuredProject.authorImgSrc}
                authorName={featuredProject.authorName}
                authorHref={featuredProject.authorHref}
                className="h-full"
                index={0}
              />
            </div>
          )}
          
          {/* Primera card no-destacada */}
          {nonFeaturedProjects.length > 0 && (
            <div className="aspect-[9/16]">
              <FeaturedCard
                title={nonFeaturedProjects[0].title}
                description={nonFeaturedProjects[0].description}
                imgSrc={nonFeaturedProjects[0].imgSrc}
                href={nonFeaturedProjects[0].href}
                authorImgSrc={nonFeaturedProjects[0].authorImgSrc}
                authorName={nonFeaturedProjects[0].authorName}
                authorHref={nonFeaturedProjects[0].authorHref}
                className="h-full"
                index={1}
              />
            </div>
          )}

          {/* Segunda card no-destacada */}
          {nonFeaturedProjects.length > 1 && (
            <div className="aspect-[9/16]">
              <FeaturedCard
                title={nonFeaturedProjects[1].title}
                description={nonFeaturedProjects[1].description}
                imgSrc={nonFeaturedProjects[1].imgSrc}
                href={nonFeaturedProjects[1].href}
                authorImgSrc={nonFeaturedProjects[1].authorImgSrc}
                authorName={nonFeaturedProjects[1].authorName}
                authorHref={nonFeaturedProjects[1].authorHref}
                className="h-full"
                index={2}
              />
            </div>
          )}
        </div>
      </div>
    </SectionContainer>
  )
}

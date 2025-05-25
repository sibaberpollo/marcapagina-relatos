import { getFeaturedAndNonFeaturedRelatos } from '../lib/sanity'
// import { getSortedProjects, getFeaturedProject, getNonFeaturedProjects } from '@/data/projectsData'
//import Card from '@/components/Card'
import FeaturedCard from '@/components/FeaturedCard'
import FeaturedSlider from '@/components/FeaturedSlider'
import siteMetadata from '@/data/siteMetadata';
import SectionContainer from '@/components/SectionContainer'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import PublishBanner from '@/components/PublishBanner'

// Tipo común para ambos orígenes de datos
interface CardProps {
  title: string;
  description: string;
  imgSrc: string;
  href: string;
  authorImgSrc: string;
  authorName: string;
  authorHref: string;
  bgColor: string;
  tags: string[];
  publishedAt: string;
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

  const allProjects = [
    ...(featuredProject ? [featuredProject] : []),
    ...nonFeaturedProjects.slice(0, 2)
  ];

  return (
    <>
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
        
        {/* Grid en desktop, Slider en móvil y tablet */}
        <div className="container">
          {/* Slider para móvil y tablet */}
          <div className="lg:hidden">
            <FeaturedSlider projects={allProjects} />
          </div>

          {/* Grid para desktop */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-6">
            {allProjects.map((project, index) => (
              <div key={index} className="aspect-[4/5]">
                <FeaturedCard
                  title={project.title}
                  description={project.description}
                  imgSrc={project.imgSrc}
                  href={project.href}
                  authorImgSrc={project.authorImgSrc}
                  authorName={project.authorName}
                  authorHref={project.authorHref}
                  bgColor={project.bgColor}
                  tags={project.tags}
                  publishedAt={project.publishedAt}
                />
              </div>
            ))}
          </div>
        </div>
      </SectionContainer>

      {/* Banner de publicación a ancho completo */}
      <div className="w-full bg-primary-500 dark:bg-primary-400 mt-12">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-12 flex justify-center">
          <PublishBanner />
        </div>
      </div>

      <SectionContainer>
        <div>
          {/* Aquí iría la siguiente sección */}
        </div>
      </SectionContainer>
    </>
  )
}

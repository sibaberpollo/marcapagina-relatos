import { getFeaturedAndNonFeaturedRelatos, getAllMicrocuentos } from '../lib/sanity'
// import { getSortedProjects, getFeaturedProject, getNonFeaturedProjects } from '@/data/projectsData'
//import Card from '@/components/Card'
import FeaturedCard from '@/components/FeaturedCard'
import FeaturedSlider from '@/components/FeaturedSlider'
import siteMetadata from '@/data/siteMetadata';
import SectionContainer from '@/components/SectionContainer'
import ViewToggle from '@/components/ViewToggle'
import ClientRedirect from '@/components/ClientRedirect'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import PublishBanner from '@/components/PublishBanner'
import MicrocuentoCard from '@/components/MicrocuentoCard'
import HighlightStroke from '@/components/HighlightStroke'

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

interface Proyecto {
  title: string
  description: string
  imgSrc: string
  href: string
  authorImgSrc: string
  authorName: string
  authorHref: string
  bgColor: string
  tags: string[]
  publishedAt: string
}

interface MicrocuentoData {
  title: string
  author: string
  description: string
  imgSrc: string
  href: string
  bgColor: string
  tags: string[]
  publishedAt: string
}

export default async function Page() {
  // Obtener datos desde Sanity
  let featuredProject: CardProps | null = null;
  let nonFeaturedProjects: CardProps[] = [];
  const allMicrocuentos = await getAllMicrocuentos();
  
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
    ...nonFeaturedProjects
  ];

  return (
    <>
      <ClientRedirect />
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
        
        {/* Botones de cambio de vista */}
        <ViewToggle />
        
        {/* Primera fila: 3 relatos sin slider */}
        <div className="container pb-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
            {allProjects.slice(0, 3).map((project, index) => (
              <div key={index} className="flex">
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
      <div className="w-full bg-primary-500 dark:bg-primary-400">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-12 flex justify-center">
          <PublishBanner />
        </div>
      </div>

      <SectionContainer>
        {/* Grid en desktop, Slider en móvil y tablet */}
        <div className="container pt-12">
          {/* Slider para móvil y tablet */}
          <div className="lg:hidden">
            <FeaturedSlider projects={allProjects.slice(3, 6)} />
          </div>

          {/* Grid para desktop */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-6">
            {allProjects.slice(3, 6).map((project, index) => (
              <div key={index} className="flex">
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

        {/* Sección de Microcuentos */}
        {allMicrocuentos.length > 0 && (
          <div className="container pt-16 pb-12">
            <div className="mb-8">
              <h2 className="text-2xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-gray-50 sm:text-3xl sm:leading-9 md:text-4xl md:leading-10">
                Microcuentos
              </h2>
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6 auto-rows-fr">
              {allMicrocuentos.slice(0, 6).map((microcuento, index) => (
                <div key={index} className="flex h-full">
                  <MicrocuentoCard
                    title={microcuento.title}
                    author={microcuento.author}
                    description={microcuento.description}
                    imgSrc={microcuento.imgSrc}
                    href={microcuento.href}
                    bgColor={microcuento.bgColor}
                    tags={microcuento.tags}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </SectionContainer>
    </>
  )
}

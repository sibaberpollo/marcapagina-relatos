import {
  getFeaturedAndNonFeaturedRelatos,
  getAllMicrocuentos,
  getAllRelatosForChronological,
  getAllRelatosForChronologicalBySite,
  getSiteBySlug,
} from "../lib/sanity";
// import { getSortedProjects, getFeaturedProject, getNonFeaturedProjects } from '@/data/projectsData'
//import Card from '@/components/Card'
import FeaturedCard from "@/components/FeaturedCard";
import FeaturedSlider from "@/components/FeaturedSlider";
import SectionContainer from "@/components/SectionContainer";
import ViewToggle from "@/components/ViewToggle";
import ClientRedirect from "@/components/ClientRedirect";
import PublishBanner from "@/components/PublishBanner";
import MicrocuentoCard from "@/components/MicrocuentoCard";
import Image from "next/image";
import Logo from '@/data/logo.svg'
import ExpandableText from '@/components/ExpandableText'
import ChronologicalView from '@/components/ChronologicalView'
import Link from 'next/link'
import { Rss } from 'lucide-react'

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

interface MicrocuentoData {
  title: string;
  author: string;
  description: string;
  imgSrc: string;
  href: string;
  bgColor: string;
  tags: string[];
  publishedAt: string;
}

export default async function Page() {
  // Obtener datos desde Sanity
  let featuredProject: CardProps | null = null;
  let nonFeaturedProjects: CardProps[] = [];
  const allMicrocuentos = await getAllMicrocuentos();
  const allRelatos = await getAllRelatosForChronological();
  const totalRelatos = allRelatos.length;
  const siteInfo = await getSiteBySlug('transtextos');
  const allRelatosTranstextos = await getAllRelatosForChronologicalBySite('transtextos');
  const latestTranstextos = allRelatosTranstextos.slice(0, 5);
  const currentPage = 1;

  try {
    console.log("Obteniendo datos desde Sanity");
    const { featured, nonFeatured } = await getFeaturedAndNonFeaturedRelatos();
    featuredProject = featured;
    nonFeaturedProjects = nonFeatured;
    console.log("Datos obtenidos de Sanity:", {
      featuredProject: featuredProject?.title,
      nonFeaturedCount: nonFeaturedProjects.length,
    });
  } catch (error) {
    console.error("Error al obtener datos de Sanity:", error);
  }

  const allProjects = [
    ...(featuredProject ? [featuredProject] : []),
    ...nonFeaturedProjects,
  ];

  return (
    <>
      <ClientRedirect />
      <SectionContainer>
        <div className="space-y-2 pt-6 pb-4 md:space-y-5">
          <h1
            className="text-xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-gray-50 
                      sm:text-3xl sm:leading-9 md:text-5xl md:leading-12"
          >
            Lee relatos breves y microcuentos
          </h1>
          <ExpandableText previewLines={2} className="prose dark:prose-invert max-w-none mb-4">
            <div className="prose dark:prose-invert max-w-none mb-4">
              <p className="text-lg leading-7 text-gray-700 dark:text-gray-300">
                <strong>MarcaPágina</strong> es una app literaria para leer relatos breves, 
                microcuentos y ficción contemporánea desde cualquier dispositivo.{" "}
                <a
                  href="/acerca-de/"
                  className="!text-gray-900 hover:!text-gray-600 dark:!text-gray-50 dark:hover:!text-gray-300"
                >
                  Antes fuimos una revista,
                </a>{" "}
                ahora somos una plataforma para descubrir literatura nueva, explorar{" "} 
                <a
                  href="/playlist/"
                  className="!text-gray-900 hover:!text-gray-600 dark:!text-gray-50 dark:hover:!text-gray-300"
                >playlists</a> narrativas 
                y participar de una comunidad activa en torno a la escritura en español.  
                <br /><br />
                Hoy puedes acceder a más de{" "}
                <strong>
                  <a
                    href="/cronologico/"
                    className="!text-gray-900 hover:!text-gray-600 dark:!text-gray-50 dark:hover:!text-gray-300"
                  >
                    350 relatos y microficciones
                  </a>
                </strong>{" "}
                escritos por autores emergentes de América Latina, seleccionados con criterio editorial.
                <br /><br />
                Una parte importante de nuestro catálogo proviene del archivo de{" "}
                <a
                  href="/transtextos/"
                  className="!text-gray-900 hover:!text-gray-600 dark:!text-gray-50 dark:hover:!text-gray-300"
                >
                  Transtextos
                </a>
                , un proyecto de publicación literaria migrado recientemente a MarcaPágina. 
                Hemos integrado su fondo completo de relatos y lo seguimos expandiendo. 
                También lanzamos una{" "}
                <a
                  href="/playlist/"
                  className="!text-gray-900 hover:!text-gray-600 dark:!text-gray-50 dark:hover:!text-gray-300"
                >
                  sección de playlists
                </a>{" "}
                donde la música y la literatura dialogan: cada lista acompaña el tono de ciertos cuentos, 
                curada directamente por sus autores.
                <br /><br />
                Publicamos nuevos relatos cada semana. MarcaPágina funciona como aplicación web: 
                puedes leer desde tu navegador o instalarla como PWA en tu celular para llevar tus lecturas donde quieras.
                <br /><br />
                Estamos construyendo el mejor espacio para leer literatura breve en internet. Esto recién comienza.
              </p>
            </div>
          </ExpandableText>
        </div>

        {/* Botones de cambio de vista */}
        <ViewToggle total={totalRelatos} />

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
              <h2 className="sr-only">Microcuentos</h2>
              <Image
                src="https://res.cloudinary.com/dx98vnos1/image/upload/v1748448325/microcuentos_h1_ttuzc5.png"
                alt="Microcuentos"
                className="h-8 sm:h-10 md:h-12 w-auto"
                width={300}
                height={60}
                priority
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6 auto-rows-fr">
              {allMicrocuentos.slice(0, 3).map((microcuento, index) => (
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

      <SectionContainer>
        <div className="space-y-2 pt-6 pb-4 md:space-y-5">
          <h1 className="text-xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-gray-50 sm:text-3xl sm:leading-9 md:text-5xl md:leading-12 flex items-center gap-2">
            {siteInfo?.title || 'Transtextos'}
            <Rss className="w-7 h-7" style={{ color: '#f26522' }} />
          </h1>
        </div>
        <div className="container">
          <ChronologicalView items={latestTranstextos} itemsPerPage={10} currentPage={currentPage} />
          <div className="mt-8 flex justify-center">
            <Link href="/transtextos" className="inline-block px-4 py-2 rounded bg-black text-white hover:bg-gray-800 transition-colors">
              Ver todos
            </Link>
          </div>
        </div>
      </SectionContainer>

    </>
  );
}

'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import FeaturedCard from './FeaturedCard'

interface CardProps {
  title: string;
  description: string;
  imgSrc: string;
  href: string;
  authorImgSrc: string;
  authorName: string;
  authorHref: string;
}

interface FeaturedSliderProps {
  projects: CardProps[];
}

export default function FeaturedSlider({ projects }: FeaturedSliderProps) {
  return (
    <div className="relative pb-12">
      <Swiper
        modules={[Pagination]}
        spaceBetween={20}
        slidesPerView={1}
        pagination={{ 
          clickable: true,
          el: '.swiper-pagination',
          bulletClass: 'swiper-pagination-bullet',
          bulletActiveClass: 'swiper-pagination-bullet-active',
        }}
        className="w-full"
      >
        {projects.map((project, index) => (
          <SwiperSlide key={index}>
            <div className="aspect-[4/5]">
              <FeaturedCard
                title={project.title}
                description={project.description}
                imgSrc={project.imgSrc}
                href={project.href}
                authorImgSrc={project.authorImgSrc}
                authorName={project.authorName}
                authorHref={project.authorHref}
                className="h-full"
                index={index}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="swiper-pagination !bottom-0" />
      <style jsx global>{`
        .swiper-pagination {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          gap: 8px;
        }
        .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: var(--color-gray-300);
          backdrop-filter: blur(4px);
          opacity: 1;
          margin: 0 !important;
        }
        .swiper-pagination-bullet-active {
          background: var(--color-gray-900);
        }
        :global(.dark) .swiper-pagination-bullet {
          background: var(--color-gray-600);
        }
        :global(.dark) .swiper-pagination-bullet-active {
          background: var(--color-accent);
        }
      `}</style>
    </div>
  )
} 
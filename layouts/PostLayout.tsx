// layouts/PostLayout.tsx
import React, { ReactNode } from "react";
import { CoreContent } from "pliny/utils/contentlayer";
import type { Authors } from "contentlayer/generated";
import Comments from "@/components/Comments";
import Link from "@/components/Link";
import PageTitle from "@/components/PageTitle";
import SectionContainer from "@/components/SectionContainer";
import Image from "@/components/Image";
import Tag from "@/components/Tag";
import siteMetadata from "@/data/siteMetadata";
import seriesMetadata from "@/data/seriesMetadata";
import ScrollTopAndComment from "@/components/ScrollTopAndComment";
import { PageSEO } from "@/components/SEO";
import { getRelativeTime } from "@/lib/time";
import FeaturedSlider from "@/components/FeaturedSlider";
import FeaturedCard from "@/components/FeaturedCard";
import { getFeaturedAndNonFeaturedRelatos } from "@/lib/sanity";
import ShareIcons from "@/components/ShareIcons";

const editUrl = (path: string) =>
  `${siteMetadata.siteRepo}/blob/main/data/${path}`;
const discussUrl = (path: string) =>
  `https://mobile.twitter.com/search?q=${encodeURIComponent(`${siteMetadata.siteUrl}/${path}`)}`;

const postDateTemplate: Intl.DateTimeFormatOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

interface LayoutProps {
  content: CoreContent<any>;
  authorDetails: CoreContent<Authors>[];
  next?: { path: string; title: string };
  prev?: { path: string; title: string };
  children: ReactNode;
}

interface PostLayoutProps extends LayoutProps {
  showDropCap?: boolean;
  autor?: { name: string; slug: string } | null;
}

export default async function PostLayout({
  content,
  authorDetails,
  next,
  prev,
  children,
  showDropCap = true,
  autor,
}: PostLayoutProps) {
  const {
    filePath,
    path,
    slug,
    date,
    title,
    tags,
    series,
    image,
    bgColor,
    publishedAt,
  } = content as any;
  const relativeTime = publishedAt ? getRelativeTime(publishedAt) : null;
  // Determinar si es relato o artículo según la ruta
  const segments = path.split("/");
  const type = segments[1]; // 'relato' o 'articulo'
  const isArticle = type === "articulo";
  const prevLabel = isArticle ? "Artículo anterior" : "Relato anterior";
  const nextLabel = isArticle ? "Próximo artículo" : "Próximo relato";
  const basePath = path.split("/")[0];

  const { featured, nonFeatured } = await getFeaturedAndNonFeaturedRelatos();
  const sliderPosts = [...(featured ? [featured] : []), ...nonFeatured]
    .slice(0, 6)
    .filter((p) => p.href !== `/${path}`);

  return (
    <div className="relative">
      <PageSEO
        title={`${title} - ${siteMetadata.title}`}
        description={content.summary}
        ogType="article"
        ogImage={content.images?.[0]}
        twImage={content.images?.[0]}
      />
      <SectionContainer>
        <ScrollTopAndComment />
        <article>
          <div className="xl:divide-y xl:divide-gray-200 xl:dark:divide-gray-700 mb-10">
            <header className="pt-6 xl:pb-6">
              <div className="space-y-1 text-center">
                <dl className="space-y-10">
                  <div>
                    <dt className="sr-only">Publicado</dt>
                    <dd className="text-base leading-6 font-medium text-gray-500 dark:text-gray-400">
                      {relativeTime && (
                        <time dateTime={publishedAt}>{relativeTime}</time>
                      )}
                    </dd>
                  </div>
                </dl>
                {autor && autor.name && autor.slug && (
                  <div className="mb-2 text-[16px] font-semibold text-gray-900 dark:text-gray-100 flex justify-center">
                    <a
                      href={`/autor/${autor.slug}`}
                      className="hover:underline text-gray-900 dark:text-gray-100 text-center"
                      style={{ display: "inline-block" }}
                    >
                      {autor.name}
                    </a>
                  </div>
                )}
                <div>
                  <PageTitle>{title}</PageTitle>
                </div>
                {series && seriesMetadata[series] && (
                  <div className="mt-4 text-base leading-6 font-medium text-gray-500 dark:text-gray-400">
                    <p>Serie: {seriesMetadata[series].name}</p>
                  </div>
                )}
                {/* Imagen del relato opcional */}
                {image && (
                  <div
                    className="relative w-full"
                    style={{ backgroundColor: bgColor }}
                  >
                    <div className="max-h-[500px] flex items-center justify-center">
                      <img
                        src={image}
                        alt="Imagen del relato"
                        className="h-full w-auto object-contain object-center"
                        width={625}
                        height={500}
                      />
                    </div>
                  </div>
                )}
              </div>
            </header>

            <div className="grid-rows-[auto_1fr] divide-y-2 divide-black dark:divide-black pb-8 xl:grid xl:grid-cols-4 xl:gap-x-6 xl:divide-y-0 dark:divide-gray-700">
              <dl className="hidden md:flex pt-6 pb-10 xl:border-b xl:border-gray-200 xl:pt-11 xl:dark:border-gray-700">
                <dt className="sr-only">Authors</dt>
                <dd>
                  <ul className="flex flex-wrap justify-center gap-4 sm:space-x-12 xl:block xl:space-y-8 xl:space-x-0">
                    {authorDetails.map((author) => (
                      <li
                        className="flex items-center space-x-2"
                        key={author.name}
                      >
                        {author.avatar && (
                          <Image
                            src={author.avatar}
                            width={38}
                            height={38}
                            alt={author.name}
                            className="h-10 w-10 rounded-full"
                          />
                        )}
                        <dl className="text-sm leading-5 font-medium whitespace-nowrap">
                          <dt className="sr-only">Name</dt>
                          <dd>
                            <Link href={`/autor/${author.slug}`} className="hover:underline">
                              {author.name}
                            </Link>
                          </dd>
                          <dt className="sr-only">Twitter</dt>
                          <dd>
                            {author.twitter && (
                              <Link href={author.twitter} className="hover:underline">
                                {author.twitter
                                  .replace("https://twitter.com/", "@")
                                  .replace("https://x.com/", "@")}
                              </Link>
                            )}
                          </dd>
                        </dl>
                      </li>
                    ))}
                  </ul>
                </dd>
              </dl>

              <div className="divide-y divide-gray-200 xl:col-span-3 xl:row-span-2 xl:pb-0 dark:divide-gray-700">
                <div
                  id="post-content"
                  className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
                >
                  {showDropCap ? (
                    <div className="prose dark:prose-invert max-w-none [&_p]:!text-lg [&_p]:!leading-7 md:[&_p]:!text-base md:[&_p]:!leading-7 [&_a]:!no-underline hover:[&_a]:underline">
                      {(() => {
                        // Si children es un solo div (como PortableText suele hacer), aplica drop-cap al primer <p>
                        if (
                          children &&
                          typeof children === "object" &&
                          "type" in children &&
                          children.type === "div" &&
                          React.isValidElement(children) &&
                          React.isValidElement(children) &&
                          Array.isArray(
                            (children as React.ReactElement<any>).props
                              ?.children,
                          )
                        ) {
                          const innerChildren = (
                            children as React.ReactElement<any>
                          ).props.children;
                          return (
                            <div
                              {...(children as React.ReactElement<any>).props}
                            >
                              {(innerChildren as React.ReactNode[]).map(
                                (child, idx) => {
                                  if (
                                    idx === 0 &&
                                    React.isValidElement(child) &&
                                    child.type === "p"
                                  ) {
                                    const childEl =
                                      child as React.ReactElement<{
                                        className?: string;
                                      }>;
                                    return React.cloneElement(childEl, {
                                      className:
                                        (childEl.props.className || "") +
                                        " drop-cap",
                                    });
                                  }
                                  return child;
                                },
                              )}
                            </div>
                          );
                        }
                        // Si es un array de elementos
                        if (Array.isArray(children) && children.length > 0) {
                          return (
                            <>
                              {React.isValidElement(children[0])
                                ? React.cloneElement(
                                    children[0] as React.ReactElement<{
                                      className?: string;
                                    }>,
                                    {
                                      className:
                                        ((
                                          children[0] as React.ReactElement<{
                                            className?: string;
                                          }>
                                        ).props.className || "") + " drop-cap",
                                    },
                                  )
                                : children[0]}
                              {children.slice(1)}
                            </>
                          );
                        }
                        // Caso simple
                        return children;
                      })()}
                    </div>
                  ) : (
                    <div className="prose dark:prose-invert max-w-none [&_p]:!text-lg [&_p]:!leading-7 md:[&_p]:!text-base md:[&_p]:!leading-7 [&_a]:!no-underline hover:[&_a]:underline">
                      {children}
                    </div>
                  )}
                  <ShareIcons title={title} slug={slug} className="my-4" />
                  {tags && tags.length > 0 && (
                    <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                      <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-4">
                        Tags
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag: string) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-black text-white"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <footer>
                <div className="divide-gray-200 text-sm leading-5 font-medium xl:col-start-1 xl:row-start-2 xl:divide-y dark:divide-gray-700">
                  {(next || prev) && (
                    <div className="flex justify-between py-4 xl:block xl:space-y-8 xl:py-8">
                      {prev && (
                        <div>
                          <h2 className="text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">
                            {prevLabel}
                          </h2>
                          <div>
                            <Link href={`/${prev.path}`}>{prev.title}</Link>
                          </div>
                        </div>
                      )}
                      {next && (
                        <div>
                          <h2 className="text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">
                            {nextLabel}
                          </h2>
                          <div>
                            <Link href={`/${next.path}`}>{next.title}</Link>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="pt-4 xl:pt-8">
                  <Link
                    href={`/`}
                    className="m-1 font-medium text-[#3b2c14] hover:text-[#5b4a32] dark:text-[#f8f8f8] dark:hover:text-white"
                    aria-label="Volver a Inicio"
                  >
                    &larr; Volver a Inicio
                  </Link>
                </div>
              </footer>
            </div>
          </div>
        </article>
      </SectionContainer>
      
      {/* Sección "También en portada" al ancho completo */}
      {sliderPosts.length > 0 && (
        <SectionContainer>
          <div className="-mt-16 mb-8">
            <h1 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-4">
              También en portada:
            </h1>
            <div className="lg:hidden">
              <FeaturedSlider projects={sliderPosts} />
            </div>
            <div className="hidden lg:grid lg:grid-cols-3 gap-6">
              {sliderPosts.slice(0, 3).map((project, index) => (
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
      )}
    </div>
  );
}

interface Project {
  title: string;
  description: string;
  href?: string;
  imgSrc?: string;
  authorImgSrc?: string;
  authorName?: string;
  authorHref?: string;
  order: number;
  featured?: boolean;
}

const projectsData: Project[] = [
  {
    title: 'Peligos de la carne',
    description: 'Todas las ciudades guardan sus secretos, sus misterios insondables, sus calles oscuras, sus espacios siniestros.',
    imgSrc: 'pecados_poejzv.jpg',
    authorImgSrc: '/static/images/gregory_zambrano.jpg',
    authorName: 'Gregory Zambrano',
    authorHref: '/autor/gregory',
    href: '/gregory/relato/peligros-de-la-carne',
    order: 0,
    featured: true,
  },
  {
    title: 'Mishalba',
    description: 'Decían que antes fue juez. Que impartía sentencias en la corte de un mundo que ya no existe. Pero ahora, Mishalba cocina. Y lo hace con la misma determinación con la que antes dictaba justicia: mide el sabor como quien sopesa el alma.',
    imgSrc: 'mishalba_pteev5.jpg',
    authorImgSrc: '/static/images/vanessa.jpg',
    authorName: 'Vanessa Sosa',
    authorHref: '/autor/vanessa',
    href: '/vanessa/relato/mishalba',
    order: 1,
  },
  {
    title: 'Tormenta Isaac',
    description: 'A simple vista, Isaac Sullivan parecía un hombre normal, con sus mañas y rarezas como cualquiera. Corpulento, siempre de saco y camisa abierta...',
    imgSrc: 'tormenta-isaac-1200x675-crop_gw6gaa.jpg',
    authorImgSrc: '/static/images/oscar.jpg',
    authorName: 'Óscar',
    authorHref: '/autor/oscar',
    href: '/oscar/relato/tormenta-isaac',
    order: 2,
  },
  {
    title: 'Un cuento chino',
    description: 'Las ciudades del interior de un país siempre suponen una apuesta por lo desconocido. En Latinoamérica este fenómeno se potencia, pues, según quien mire y visite, la percepción de la provincia puede balancearse entre lo bucólico y lo agreste, lo bárbaro, lo peligroso.',
    imgSrc: 'chipen_oje3fc.jpg',
    authorImgSrc: '/static/images/hazael.png',
    authorName: 'Hazael',
    authorHref: '/autor/hazael',
    href: '/hazael/relato/un-cuento-chino',
    order: 3,
  },
  {
    title: 'El evangelio según Asdrúbal',
    description: `En un altar improvisado, reposaba un libro de tapas negras gastadas y papel tan delgado como las Biblias que reparten los evangelistas. —Nadie lo toque —nos advirtió la bruja que lo resguardaba—. Tiene demasiada energía.`,
    imgSrc: 'elevengaliodeasdrubal_wjmkc2.jpg',
    authorImgSrc: '/static/images/pino.jpg',
    authorName: 'Pino',
    authorHref: '/autor/pino',
    href: '/pino/relato/el-evangelio-de-asdrubal',
    order: 4,
  },
];

export const getSortedProjects = () => {
  return [...projectsData].sort((a, b) => a.order - b.order);
};

export const getFeaturedProject = () => {
  return projectsData.find(project => project.featured === true);
};

export const getNonFeaturedProjects = () => {
  return [...projectsData].filter(project => !project.featured)
    .sort((a, b) => a.order - b.order);
};

export default projectsData;
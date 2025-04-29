interface Project {
  title: string;
  description: string;
  href?: string;
  imgSrc?: string;
  authorImgSrc?: string;
  authorName?: string;
  authorHref?: string;
  order: number;
}

const projectsData: Project[] = [
  {
    title: 'El evangelio según Asdrúbal',
    description: `En un altar improvisado, reposaba un libro de tapas negras gastadas y papel tan delgado como las Biblias que reparten los evangelistas. —Nadie lo toque —nos advirtió la bruja que lo resguardaba—. Tiene demasiada energía.`,
    imgSrc: '/static/images/ilustraciones/elevengaliodeasdrubal.png',
    authorImgSrc: '/static/images/pino.jpg',
    authorName: 'Pino',
    authorHref: '/autor/pino',
    href: '/pino/relato/el-evangelio-de-asdrubal',
    order: 2,
  },
  {
    title: 'Un cuento chino',
    description: 'Las ciudades del interior de un país siempre suponen una apuesta por lo desconocido. En Latinoamérica este fenómeno se potencia, pues, según quien mire y visite, la percepción de la provincia puede balancearse entre lo bucólico y lo agreste, lo bárbaro, lo peligroso.', 
    imgSrc: '/static/images/ilustraciones/chipen.png',
    authorImgSrc: '/static/images/hazael.png',
    authorName: 'Hazael',
    authorHref: '/autor/hazael',
    href: '/hazael/relato/un-cuento-chino',
    order: 1,
  }
];

export const getSortedProjects = () => {
  return [...projectsData].sort((a, b) => a.order - b.order);
};

export default projectsData;
interface Project {
  title: string;
  description: string;
  href?: string;
  imgSrc?: string;
  authorImgSrc?: string;
  authorName?: string;
  authorHref?: string;
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
  },
  {
    title: 'Gambeta',
    description: `"La lluvia sobre el asfalto huele a algo distinto para cada quien, desde la nostalgia por los amores sin nombres, hasta la inminencia de la tragedia para quien vivió una vaguada."

Por Hazael, editor principal y especialista en narrativa contemporánea.`,
    imgSrc: '/static/images/ilustraciones/gambeta.png',
    authorImgSrc: '/static/images/hazael.png',
    authorName: 'Hazael',
    authorHref: '/autor/hazael',
    href: '/hazael/relato/gambeta',
  }
];

export default projectsData;
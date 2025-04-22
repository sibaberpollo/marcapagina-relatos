interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
  authorImgSrc?: string
}

const projectsData: Project[] = [
  {
    title: 'Gambeta',
    description: `"La lluvia sobre el asfalto huele a algo distinto para cada quien, desde la nostalgia por los amores sin nombres, hasta la inminencia de la tragedia para quien vivió una vaguada."
    
    Por Hazael, editor principal y especialista en narrativa contemporánea.`,
    imgSrc: '/static/images/gambeta.png',
    authorImgSrc: '/static/images/hazael.png',
    href: '/blog',
  },
  {
    title: 'El evangelio según Asdrúbal',
    description: `"Yo crecí temiéndole a María Lionza. Mi abuela decía que si la veía en sueños, algo terrible iba a pasar. Años después, cerraba los ojos y la veía acechándome desde la montaña, los brazos extendidos, la silueta temblando en la niebla."
    
    Por Pino, editor asociado, especializado en narrativa folklórica.`,
    imgSrc: '/static/images/asdrubal.png',
    authorImgSrc: '/static/images/pino.jpg',
    href: '/blog',
  },
]

export default projectsData

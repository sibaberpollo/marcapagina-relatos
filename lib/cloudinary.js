// Cloudinary configuration
export const cloudConfig = {
  cloudName: 'dx98vnos1',
  apiKey: '432457816871417',
  apiSecret: 'zG46SVj8uLPSqnGmRsiTyF1rJ-Q',
  secure: true,
}

// Helper to transform local paths to Cloudinary URLs
export const getCloudinaryUrl = (src) => {
  if (src.startsWith('https://')) return src

  const baseUrl = `https://res.cloudinary.com/${cloudConfig.cloudName}/image/upload`
  const path = src.startsWith('/') ? src.substring(1) : src

  return `${baseUrl}/${path}`
}

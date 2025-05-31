export function toVersal(text: string): string {
  if (!text) return ''
  
  return text
    .split(' ')
    .map(word => {
      if (word.length === 0) return word
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    })
    .join(' ')
} 
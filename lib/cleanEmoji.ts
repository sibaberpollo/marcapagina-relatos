// Elimina todos los emojis de un string
export function cleanEmoji(text: string): string {
  // Expresión regular para la mayoría de emojis unicode
  return text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF]+|[\u2011-\u26FF]|[\uD83D\uDE00-\uD83D\uDE4F]|[\uD83D\uDC00-\uD83D\uDFFF]|[\uD83C\uDF00-\uD83D\uDDFF]|[\uD83E\uDD00-\uD83E\uDDFF]|[\uD83C\uDDE6-\uD83C\uDDFF]{1,2}|[\uD83C\uDFFB-\uD83C\uDFFF]|[\u2600-\u26FF]|[\uD83D\uDC00-\uD83D\uDFFF]|[\uD83E\uDD00-\uD83E\uDDFF])/gu, '');
}

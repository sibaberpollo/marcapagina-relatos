export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  const intervals = {
    año: 31536000,
    mes: 2592000,
    semana: 604800,
    día: 86400,
    hora: 3600,
    minuto: 60
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const diff = Math.floor(diffInSeconds / secondsInUnit);
    
    if (diff >= 1) {
      return `Hace ${diff} ${unit}${diff === 1 ? '' : 's'}`;
    }
  }

  return 'Hace un momento';
} 
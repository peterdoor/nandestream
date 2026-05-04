export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

export function formatFecha(fecha: string): string {
  if (!fecha) return '';
  const d = new Date(fecha + 'T00:00:00');
  return d.toLocaleDateString('es-PY', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatFechaCorta(fecha: string): string {
  if (!fecha) return '';
  const d = new Date(fecha + 'T00:00:00');
  return d.toLocaleDateString('es-PY', {
    day: 'numeric',
    month: 'short',
  });
}

export function tiempoRelativo(fecha: string): string {
  if (!fecha) return '';
  const ahora = new Date();
  const d = new Date(fecha + 'T00:00:00');
  const diff = Math.floor((ahora.getTime() - d.getTime()) / 1000);

  if (diff < 3600)  return `Hace ${Math.floor(diff / 60)} minutos`;
  if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} horas`;
  if (diff < 172800) return 'Ayer';
  return formatFecha(fecha);
}

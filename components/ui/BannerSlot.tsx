type BannerProps = {
  imagen_url: string;
  link_url: string;
  titulo: string;
  className?: string;
};

export default function BannerSlot({ imagen_url, link_url, titulo, className = '' }: BannerProps) {
  if (!imagen_url) return null;

  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imagen_url}
      alt={titulo || 'Banner'}
      className={`w-full object-cover ${className}`}
    />
  );

  if (link_url) {
    return (
      <a href={link_url} target="_blank" rel="noopener noreferrer"
        className="block hover:opacity-95 transition-opacity">
        {img}
      </a>
    );
  }
  return <div>{img}</div>;
}

interface Props { src?: string; alt: string; tone?: string[]; className?: string; width: number; height: number; eager?: boolean }

/** Photo with colour placeholder and optimized image loading. */
export function PhotoSlot({ src, alt, tone, className = '', width, height, eager }: Props) {
  const bg = tone && tone.length >= 2 ? `linear-gradient(160deg, ${tone[0]}, ${tone[1]})` : '#E8D7C5'
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: bg, aspectRatio: `${width} / ${height}` }}
      role="img"
      aria-label={alt}
    >
      {src && (
        <img
          src={src}
          alt=""
          width={width}
          height={height}
          loading={eager ? 'eager' : 'lazy'}
          fetchPriority={eager ? 'high' : 'auto'}
          decoding="async"
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-active:scale-105"
        />
      )}
    </div>
  )
}

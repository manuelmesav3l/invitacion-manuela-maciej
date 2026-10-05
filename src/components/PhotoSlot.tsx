interface Props { src?: string; alt: string; tone: string[]; className?: string; width: number; height: number; eager?: boolean }

/** Photo with colour placeholder. TODO_ASSET: while `src` is empty a tonal gradient stands in. */
export function PhotoSlot({ src, alt, tone, className = '', width, height, eager }: Props) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: `linear-gradient(160deg, ${tone[0]}, ${tone[1]})`, aspectRatio: `${width} / ${height}` }}
      role="img"
      aria-label={alt}
    >
      {src && (
        <img src={src} alt="" width={width} height={height} loading={eager ? 'eager' : 'lazy'} decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-active:scale-110" />
      )}
    </div>
  )
}

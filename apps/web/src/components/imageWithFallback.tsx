interface Props {
  src: string;
  alt: string;
  className?: string;
}

export function ImageWithFallback({ src, alt, className }: Props) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        (e.target as HTMLImageElement).src =
          "https://placehold.co/600x400/1e1b4b/white?text=Content+Repurposer";
      }}
    />
  );
}

/**
 * Imagem responsiva com WebP e fallback JPEG.
 *
 * As fotos originais têm 1800px e pesavam 230–350 kB cada, num tamanho único servido
 * para qualquer tela — era o que segurava o LCP. As variantes (640/1024/1600, .webp e
 * .jpg) são geradas junto com os arquivos em client/public/img.
 *
 * O <picture> usa `display: contents` (em index.css) para não criar caixa própria:
 * o <img> continua sendo filho direto do layout, então as regras existentes de
 * object-fit e height:100% seguem valendo.
 */
type PictureProps = {
  /** caminho do .jpg original, ex.: /img/extensao-facil-hero_ba2e9b46.jpg */
  src: string;
  alt: string;
  className?: string;
  /** true na imagem de LCP (o hero): carrega cedo, sem lazy */
  eager?: boolean;
  sizes?: string;
};

const WIDTHS = [640, 1024, 1600] as const;

export function Picture({ src, alt, className, eager = false, sizes = "100vw" }: PictureProps) {
  const base = src.replace(/\.jpg$/, "");
  const webp = WIDTHS.map((w) => `${base}-${w}.webp ${w}w`).join(", ");
  const jpeg = WIDTHS.map((w) => `${w === 1600 ? src : `${base}-${w}.jpg`} ${w}w`).join(", ");

  return (
    <picture>
      <source type="image/webp" srcSet={webp} sizes={sizes} />
      <img
        src={src}
        srcSet={jpeg}
        sizes={sizes}
        alt={alt}
        className={className}
        decoding="async"
        {...(eager ? { fetchPriority: "high" as const } : { loading: "lazy" as const })}
      />
    </picture>
  );
}

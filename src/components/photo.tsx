import Link from "next/link";
import { type Pic } from "@/content/photos";
import { cn } from "@/lib/utils";

// Фото с подписью — <figure> и <figcaption>: подпись видна людям и поисковикам (03-design §7).
// srcset: 720 и 1440 px по ширине; для разворотов на десктопе — широкий кадр 16:9 (960 и 1920 px).
type PhotoProps = {
  p: Pic;
  ratio?: string; // класс пропорции, например aspect-[3/4]
  sizes?: string;
  eager?: boolean;
  caption?: boolean | React.ReactNode;
  index?: string; // «Fig. 01»
  link?: boolean;
  parallax?: boolean;
  className?: string;
  imgClassName?: string;
  position?: string; // object-position
};

export function Img({ p, sizes = "100vw", eager, wide, className, position, alt }: { p: Pic; sizes?: string; eager?: boolean; wide?: boolean; className?: string; position?: string; alt?: string }) {
  const portrait = `${p.base}-720.webp 720w, ${p.base}.webp 1440w`;
  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`${p.base}.webp`}
      srcSet={portrait}
      sizes={sizes}
      alt={alt ?? p.alt}
      width={1440}
      height={1920}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : undefined}
      decoding="async"
      className={cn("size-full object-cover", className)}
      style={position ? { objectPosition: position } : undefined}
    />
  );
  if (!wide || !p.wide) return img;
  return (
    <picture className="contents">
      <source media="(min-width: 768px)" srcSet={`${p.base}-wide-960.webp 960w, ${p.base}-wide.webp 1920w`} sizes={sizes} width={1920} height={1080} />
      {img}
    </picture>
  );
}

export function Photo({ p, ratio = "aspect-[3/4]", sizes, eager, caption = true, index, link, parallax, className, imgClassName, position }: PhotoProps) {
  const body = (
    <div className={cn("relative overflow-hidden bg-secondary", ratio)}>
      <Img p={p} sizes={sizes} eager={eager} position={position} className={cn(parallax && "parallax", link && "transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]", imgClassName)} />
    </div>
  );
  return (
    <figure className={cn("group", className)}>
      {link ? <Link href={p.href} aria-label={`${p.place}: ${p.caption}`}>{body}</Link> : body}
      {caption && (
        <figcaption className="mt-3 flex items-baseline gap-3 text-[13px] leading-snug text-muted-foreground">
          {index && <span className="label-tech shrink-0 text-foreground">{index}</span>}
          <span>{caption === true ? <>{p.caption}{p.place && <span className="text-foreground/70"> · {p.place}</span>}</> : caption}</span>
        </figcaption>
      )}
    </figure>
  );
}

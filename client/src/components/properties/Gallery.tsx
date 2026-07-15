import Image from "next/image";

export function Gallery({ images, title }: { images: string[]; title: string }) {
  if (images.length === 0) return null;
  const [main, ...rest] = images;
  const thumbs = rest.slice(0, 4);

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-4 sm:gap-3">
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl sm:col-span-2 sm:row-span-2">
        <Image
          src={main}
          alt={title}
          fill
          priority
          sizes="(min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      {thumbs.map((src, i) => (
        <div key={src + i} className="relative aspect-[16/10] overflow-hidden rounded-2xl">
          <Image
            src={src}
            alt={`${title} photo ${i + 2}`}
            fill
            sizes="25vw"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}

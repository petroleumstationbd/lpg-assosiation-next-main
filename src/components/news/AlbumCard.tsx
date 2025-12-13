
import Image, { type StaticImageData } from 'next/image';

export type Album = {
  id: string;
  title: string;
  date: string;
  description?: string;
  image: StaticImageData;
};

type AlbumCardProps = {
  album: Album;
};

const AlbumCard = ({ album }: AlbumCardProps) => {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[18px] bg-white shadow-[0_18px_40px_rgba(0,0,0,0.12)]">
      <div className="relative h-[170px] w-full md:h-[190px]">
        <Image
          src={album.image}
          alt={album.title}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col gap-1 px-4 pb-4 pt-4">
        <h3 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#003B4A]">
          {album.title}
        </h3>
        <p className="text-[11px] uppercase tracking-[0.14em] text-[#7B8C9C]">
          {album.date}
        </p>
        {album.description && (
          <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-[#53687A]">
            {album.description}
          </p>
        )}
      </div>
    </article>
  );
};

export default AlbumCard;

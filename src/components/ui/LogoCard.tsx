import Image, { type StaticImageData } from 'next/image';

export type LogoItem = {
  name: string;
  logo: StaticImageData;
};

type LogoCardProps = LogoItem & {
  className?: string;
};

export function LogoCard({ name, logo, className }: LogoCardProps) {
  return (
    <div
      className={`flex justify-between flex-col h-[140px] items-center  rounded-[14px] bg-white px-6 pt-6 py-3 shadow-[0_18px_32px_rgba(0,0,0,0.12)] ${className ?? ''}`}
    >
      <Image
        src={logo}
        alt={name}
        width={60}
        height={60}
        className="object-contain"
      />
      <p className="text-xs opacity-80">{name}</p>
    </div>
  );
}

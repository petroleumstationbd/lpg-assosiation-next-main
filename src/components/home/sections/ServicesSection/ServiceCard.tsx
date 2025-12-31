'use client';
import type { ComponentType, SVGProps } from 'react';

export type ServiceIcon = ComponentType<SVGProps<SVGSVGElement>>;

export type ServiceItem = {
  id: string;
  title: string;
  description: string;
  Icon: ServiceIcon;
};

export function ServiceCard({ item }: { item: ServiceItem }) {
  const { Icon } = item;

  return (
    <article
      className="
        relative flex h-full flex-col items-center
        rounded-[24px] border border-[#E5F0FF]
        bg-[radial-gradient(circle_at_top,_#FFFFFF,_#F4F7FF)]
        px-8 pb-8 pt-10
        shadow-[0_22px_40px_rgba(9,46,94,0.10)]
      "
    >
      {/* left green tab */}
      <div
        className="
          pointer-events-none
          absolute -left-1 top-[33%] -translate-y-1/2 -translate-x-1/2
          h-[90px] w-[28px] sm:h-[116px] sm:w-[34px]
          rounded-[10px]
          bg-[#75B551]
          shadow-[0_12px_26px_rgba(6,142,76,0.55)] -z-1
        "
      />

      {/* icon */}
      <div className="mt-2 flex h-[80px] md:h-[80px]  w-[180px] items-center justify-center sm:h-[220px] sm:w-[220px] lg:h-[250px] lg:w-[250px] lg:scale-[1.2]">
        <Icon className="h-full w-full drop-shadow-[0_20px_32px_rgba(0,176,109,0.55)] " />
      </div>

      {/* title */}
      <h3
        className="
          mt-6 text-center
          text-[18px] font-semibold uppercase text-[#153976] sm:text-[22px] lg:text-[24px]
        "
      >
        {item.title}
      </h3>

      {/* description */}
      <p
        className="
          mt-3 max-w-[260px] text-center
          text-[15px] leading-relaxed text-[#7A8799]
        "
      >
        {item.description}
      </p>
    </article>
  );
}

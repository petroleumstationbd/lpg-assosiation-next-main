'use client';

import Image, {type StaticImageData} from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import defaultBanner from '@assets/bg-img/bg-banner.jpg';

type PageHeroProps = {
   title: React.ReactNode;
   subtitle?: string;
   ctaLabel?: string;
   ctaHref?: string;
   backgroundImage?: StaticImageData;
   height?: 'full' | 'compact';
   showHeader?: boolean;
   overlayFrom?: string;
};

const heightClass: Record<NonNullable<PageHeroProps['height']>, string> = {
   full: 'min-h-[560px] md:min-h-[680px] lg:min-h-[800px]',
   compact: 'min-h-[220px] lg:min-h-[250px] bg-white',
};

export default function PageHero({
   title,
   subtitle,
   ctaLabel,
   ctaHref,
   backgroundImage = defaultBanner,
   height = 'full',
   showHeader = true,
   overlayFrom = 'down',
}: PageHeroProps) {
   return (
      <div className={`relative w-full ${heightClass[height]}`}>
         {height == 'full' && (
            <Image
               src={backgroundImage}
               alt='Page hero background'
               fill
               priority
               className='object-cover'
            />
         )}

         {/* overlay */}
{/* 
         {height == 'full' && (
            <div
               className={`pointer-events-none absolute inset-0 ${
                  overlayFrom === 'top'
                     ? 'bg-gradient-to-t'
                     : 'bg-gradient-to-b'
               } from-[#00000054] to-[#122047]`}
            />
         )} */}

         {showHeader && <Header heroSize={heightClass[height]} />}
         <div className='h-[120px]'></div>

         {/* content */}
         <div
            className={`relative flex min-h-[70%] ${
               height == 'compact'
                  ? 'md:min-h-[220px] mt-2 text-[#133374]'
                  : 'md:min-h-[600px] text-white text-shadow-xl text-shadow-black'
            } flex-col items-center justify-center px-4 lpg-container pb-6 text-center `}>
            <h1 className='text-[24px] md:text-[38px] lg:text-[48px] font-bold leading-tight tracking-[-0.04em] mt-18 md:mt-01 mb-0'
            style={{ textShadow: "0 6px 18px rgba(0,0,0,0.55)" }}
            >
               {title}
            </h1>

            {subtitle && (
               <p
                  className={`${
                     height == 'compact' ? 'text-[#133374]' : 'text-white/80'
                  } mt-3 text-[11px] md:text-[14px] font-medium tracking-[0.0em] lpg-container`}>
                  {subtitle}
               </p>
            )}

            {ctaLabel && ctaHref && (
               <div className='mt-16'>
                  <Link
                     href={ctaHref}
                     className='inline-flex items-center justify-center rounded-full btn-bg px-7 py-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white shadow-[0_8px_24px_rgba(0,166,81,0.55)]'>
                     {ctaLabel}
                  </Link>
               </div>
            )}
         </div>
      </div>
   );
}

'use client';

import {useState} from 'react';
import Image, {type StaticImageData} from 'next/image';

import bgPattern from '@assets/wrappers/footer-bg-wrapper.png';

// stacked images for "Our Albums"
import slide1 from '@assets/newsfeed-img/slider1.1.png';
import slide2 from '@assets/newsfeed-img/slider1.2.png';
import slide3 from '@assets/newsfeed-img/slider1.3.png';

/* ------------------------------------------------------------------ */
/* Types & data                                                       */
/* ------------------------------------------------------------------ */
type CardSlide = {
  id: number;
  title: string;
  description: string;
  images?: StaticImageData[];
  colSpan?: 4 | 5 | 6 | 7 | 8; // whatever spans you want
};


const cardSlides: CardSlide[] = [
  {
    id: 1,
    title: 'Our Albums',
    description:
      "We are Largest one and only LPG Auto Gas Station & Conversion Workshop Owner's Association in Bangladesh. Welcome to our Gallery.",
    images: [slide1, slide2, slide3],
    colSpan: 7, // ~58% width
  },
  {
    id: 2,
    title: 'Print Media Gallery',
    description:
      "We are Largest one and only LPG Auto Gas Station & Conversion Workshop Owner's Association in Bangladesh. Welcome to our Gallery.",
    colSpan: 5, // ~42% width
  },

   {
      id: 3,
      title: 'Our Albums',
     
      description:
         "We are Largest one and only LPG Auto Gas Station & Conversion Workshop Owner's Association in Bangladesh. Welcome to our Gallery.",
      images: [slide1, slide2, slide3],
   },
   {
      id: 4,
      title: 'Our Albums',
      description:
         "We are Largest one and only LPG Auto Gas Station & Conversion Workshop Owner's Association in Bangladesh. Welcome to our Gallery.",
      images: [slide1, slide2, slide3],
   },
   {
      id: 5,
      title: 'Our Albums',
      description:
         "We are Largest one and only LPG Auto Gas Station & Conversion Workshop Owner's Association in Bangladesh. Welcome to our Gallery.",
      images: [slide1, slide2, slide3],
   },
   {
      id: 6,
      title: 'Print Media Gallery',
      description:
         "We are Largest one and only LPG Auto Gas Station & Conversion Workshop Owner's Association in Bangladesh. Welcome to our Gallery.",
      // no images → just text card
   },
];

const CARDS_PER_PAGE = 2;

/* ------------------------------------------------------------------ */
/* Card component                                                     */
/* ------------------------------------------------------------------ */

const COL_SPAN_MAP: Record<number, string> = {
  4: 'md:col-span-4',
  5: 'md:col-span-5',
  6: 'md:col-span-6',
  7: 'md:col-span-7',
  8: 'md:col-span-8',
};

type InfoPanelProps = CardSlide;

const InfoPanel = ({ title, description, images, colSpan = 6 }: InfoPanelProps) => {
  const hasImages = images && images.length > 0;
  const colSpanClass = COL_SPAN_MAP[colSpan] ?? 'md:col-span-6';

  return (
    <article
      className={[
        'relative rounded-[18px] bg-white/95 border border-[#E1ECF4]',
        'shadow-[0_16px_40px_rgba(0,0,0,0.10)]',
        'border-t-[4px] border-t-[#6CC12A] h-[300px] flex items-center',
        colSpanClass,
      ].join(' ')}
    >
         <div
            className={[
               'flex flex-col gap-4 px-6 py-6 md:px-7 md:py-7',
               hasImages
                  ? 'md:grid md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.1fr)] md:items-center'
                  : '',
            ].join(' ')}>
            {/* text side */}
            <div>
               <div className='mb-3 flex items-center gap-2 md:mb-4'>
                  <div className=''>
                     <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='26'
                        height='27'
                        viewBox='0 0 26 27'
                        fill='none'>
                        <g clip-path='url(#clip0_104_3272)'>
                           <path
                              d='M21.3372 5.13135H0.53418V25.9344H21.3372V5.13135Z'
                              stroke='url(#paint0_linear_104_3272)'
                              stroke-width='1.06808'
                              stroke-miterlimit='10'
                           />
                           <path
                              d='M25.4661 0.534058H4.66309V21.3371H25.4661V0.534058Z'
                              stroke='url(#paint1_linear_104_3272)'
                              stroke-width='1.06808'
                              stroke-miterlimit='10'
                           />
                        </g>
                        <defs>
                           <linearGradient
                              id='paint0_linear_104_3272'
                              x1='0.000142148'
                              y1='15.5329'
                              x2='21.8713'
                              y2='15.5329'
                              gradientUnits='userSpaceOnUse'>
                              <stop stop-color='#75B553' />
                              <stop offset='0.9999' stop-color='#2E3092' />
                              <stop offset='1' stop-color='#474374' />
                           </linearGradient>
                           <linearGradient
                              id='paint1_linear_104_3272'
                              x1='4.12905'
                              y1='10.9356'
                              x2='26.0002'
                              y2='10.9356'
                              gradientUnits='userSpaceOnUse'>
                              <stop stop-color='#75B553' />
                              <stop offset='0.9999' stop-color='#2E3092' />
                              <stop offset='1' stop-color='#474374' />
                           </linearGradient>
                           <clipPath id='clip0_104_3272'>
                              <rect width='26' height='26.4684' fill='white' />
                           </clipPath>
                        </defs>
                     </svg>
                  </div>
                  <h3 className='text-sm font-medium  md:text-[34px]'>
                     {title}
                  </h3>
               </div>

               <p className='text-[12px] leading-[18px] text-[#979797]/70 md:text-[15px]'>
                  {description}
               </p>
            </div>

            {/* static stacked images (optional) */}
            {hasImages && (
               <div className='mt-4 flex justify-center md:mt-0'>
                  <div className='relative h-[180px] w-full max-w-[260px] md:h-[210px]'>
                     {images!.map((img, idx) => {
                        let cls =
                           'absolute inset-0 rounded-[18px] overflow-hidden transition-all duration-300 ease-out';

                        if (idx === 0) {
                           // front card
                           cls +=
                              ' z-30 translate-x-0 translate-y-0 scale-100 shadow-[0_20px_60px_rgba(0,0,0,0.20)]';
                        } else if (idx === 1) {
                           // middle
                           cls +=
                              ' z-20 translate-x-4 translate-y-3 scale-[0.96] shadow-[0_16px_40px_rgba(0,0,0,0.15)]';
                        } else if (idx === 2) {
                           // back
                           cls +=
                              ' z-10 translate-x-8 translate-y-6 scale-[0.92] shadow-[0_14px_32px_rgba(0,0,0,0.12)]';
                        } else {
                           cls += ' hidden';
                        }

                        return (
                           <div key={idx} className={cls}>
                              <Image
                                 src={img}
                                 alt={`${title} image ${idx + 1}`}
                                 fill
                                 className='object-cover'
                              />
                           </div>
                        );
                     })}
                  </div>
               </div>
            )}
         </div>
      </article>
   );
};

/* ------------------------------------------------------------------ */
/* Section with 2-card slider                                         */
/* ------------------------------------------------------------------ */

const AlbumsHeroSliderSection = () => {
   const [pageIndex, setPageIndex] = useState(0);

   const pageCount = Math.ceil(cardSlides.length / CARDS_PER_PAGE);
   const start = pageIndex * CARDS_PER_PAGE;
   const visibleCards = cardSlides.slice(start, start + CARDS_PER_PAGE);

   return (
      <section className='relative bg-[linear-gradient(180deg,#F6FCF7_0%,#EDF8F1_100%)] pb-14 pt-10 md:pb-16 md:pt-12'>
         <div className='lpg-container relative'>
            <div className='md:px-8 md:py-8'>
               {/* TWO cards visible per page */}
<div className="grid gap-4 md:gap-6 md:grid-cols-12">
                  {visibleCards.map(card => (
                     <InfoPanel key={card.id} {...card} />
                  ))}
               </div>

               {/* slider dots – control which pair of cards is shown */}
               {pageCount > 1 && (
                  <div className='mt-6 flex items-center justify-center gap-2'>
                     {Array.from({length: pageCount}).map((_, idx) => {
                        const isActive = idx === pageIndex;
                        return (
                           <button
                              key={idx}
                              type='button'
                              onClick={() => setPageIndex(idx)}
                              className={[
                                 'h-[8px] rounded-full transition-all duration-200',
                                 isActive
                                    ? 'w-10 bg-[#6CC12A]'
                                    : 'w-2 bg-[#C7D4E1]',
                              ].join(' ')}
                              aria-label={`Go to slide ${idx + 1}`}
                           />
                        );
                     })}
                  </div>
               )}
            </div>
         </div>
      </section>
   );
};

export default AlbumsHeroSliderSection;

'use client';

import {useMemo, useState, type ReactNode} from 'react';
import Image, {StaticImageData} from 'next/image';
import SectionHeading from '@/components/ui/SectionHeading';

import stationIllustration from './img/why-choose-station.png';
import pillimg1 from './img/Mask group (15).png';
import pillimg2 from './img/Mask group (16).png';
import pillimg3 from './img/Mask group (17).png';

import minigridbg from '@assets/wrappers/verticle-container-grid.png';
import maskgridbg from './img/Mask group (19).png';

type PillId = 'mission' | 'vision' | 'activities';
type ContentId = 'who' | PillId;

type PillItem = {
   id: PillId;
   label: string;
   img: StaticImageData | string;
   icon: ReactNode;
};

const InfoIcon = (
   <div className='flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white'>
      <span className='text-[20px] font-extrabold leading-none'>i</span>
   </div>
);

const PILL_ITEMS: PillItem[] = [
   {
      id: 'mission',
      label: 'OUR MISSION',
      img: pillimg1,
      icon: (
         <svg
            xmlns='http://www.w3.org/2000/svg'
            width='62'
            height='62'
            viewBox='0 0 62 62'
            fill='none'>
            <g clipPath='url(#clip0_1_824)'>
               <path
                  d='M18.2652 61.8563C12.6943 61.8563 7.12214 61.8563 1.55124 61.8563C0.500077 61.8563 0.0025611 61.5437 9.73736e-06 60.888C-0.00254163 60.2247 0.49625 59.8267 1.53721 59.9351C2.99021 60.0869 4.03499 59.5894 5.06957 58.5548C7.53802 56.0902 10.12 53.7366 12.6994 51.3842C13.3832 50.7604 13.7557 50.0856 13.9024 49.1734C14.4981 45.4944 15.1475 41.823 15.8057 38.1541C15.8631 37.8365 16.0634 37.4882 16.3032 37.2688C17.607 36.076 18.9439 34.919 20.2681 33.7479C21.2427 32.8855 21.9354 32.9889 22.5847 34.1076C25.1654 38.5521 27.7435 42.9979 30.3243 47.4423C30.4365 47.635 30.5398 47.8416 30.6878 48.0024C31.0169 48.3583 31.4303 48.4323 31.8385 48.172C32.234 47.9195 32.4011 47.5393 32.2021 47.0724C32.1153 46.8683 32.0031 46.6731 31.8908 46.4805C29.8051 42.9124 27.7359 39.3341 25.617 35.7852C25.1412 34.9879 25.1679 34.3526 25.6451 33.5655C28.4567 28.9207 31.23 24.2543 33.9957 19.5814C34.1985 19.2383 34.321 18.7931 34.3222 18.3938C34.3427 12.7323 34.3363 7.0721 34.3363 1.41063C34.3363 0.0992255 34.9269 -0.298787 36.1133 0.212761C39.7796 1.79716 43.4434 3.38666 47.1122 4.96723C47.6059 5.18027 48.0537 5.40989 48.0524 6.04263C48.0499 6.67919 47.5881 6.90499 47.0995 7.11165C43.835 8.49832 40.5705 9.89009 37.3061 11.2768C36.3863 11.6671 36.1962 11.9465 36.1962 12.9517C36.1962 14.5846 36.2753 16.2226 36.1784 17.8503C35.9972 20.9273 36.5304 23.8614 37.4336 26.798C39.0014 31.8931 40.3868 37.043 41.8705 42.1636C42.0899 42.9188 41.9406 43.4775 41.3857 44.035C38.8573 46.5685 36.3557 49.1301 33.8451 51.6827C33.1639 52.3754 33.1257 52.5948 33.5466 53.4546C34.5276 55.46 35.4461 57.5011 36.519 59.4567C37.2206 60.735 36.8787 61.8971 34.9792 61.8741C29.4083 61.8091 23.8361 61.8512 18.2652 61.8512V61.8563Z'
                  fill='white'
               />
               <path
                  d='M50.6586 61.8565C47.4146 61.8565 44.1692 61.8387 40.9252 61.868C40.0309 61.8757 39.4837 61.5619 39.0997 60.7276C38.0447 58.4364 36.917 56.1785 35.8199 53.9065C35.3862 53.0059 35.4359 52.7188 36.1312 52.0057C38.6468 49.4276 41.1561 46.8418 43.6858 44.2776C44.0812 43.8771 44.1692 43.5148 44.0111 42.9675C41.9075 35.6821 39.8268 28.389 37.7411 21.0985C37.7347 21.0768 37.7232 21.0564 37.7194 21.0347C37.6339 20.5959 37.2984 20.0894 37.8891 19.7845C38.4644 19.4873 38.7259 20.0154 39.0282 20.3509C40.0909 21.5322 41.1038 22.7594 42.2111 23.8961C43.275 24.988 44.0098 26.2484 44.6298 27.63C49.2886 38.0191 53.9882 48.3892 58.6482 58.7783C59.022 59.6101 59.5093 59.9902 60.4355 59.9303C61.4318 59.8652 61.9114 60.2224 61.9242 60.8717C61.9369 61.5172 61.4382 61.8565 60.4584 61.8565C57.1914 61.8578 53.9244 61.8565 50.6574 61.8565H50.6586Z'
                  fill='white'
               />
            </g>
            <defs>
               <clipPath id='clip0_1_824'>
                  <rect width='61.9254' height='61.8808' fill='white' />
               </clipPath>
            </defs>
         </svg>
      ),
   },
   {
      id: 'vision',
      label: 'OUR VISION',
      img: pillimg2,
      icon: (
         <svg
            xmlns='http://www.w3.org/2000/svg'
            width='64'
            height='62'
            viewBox='0 0 64 62'
            fill='none'>
            <g clipPath='url(#clip0_1_836)'>
               <path
                  d='M31.3789 50.5069C18.1972 49.9659 7.60278 44.1135 0.263687 32.4498C-0.0699083 31.9198 -0.0988826 31.5349 0.242543 30.9835C6.08672 21.5622 14.3702 15.6554 25.2246 13.596C40.3006 10.7353 55.6084 17.7692 63.4573 31.0182C63.7423 31.4994 63.7948 31.8496 63.4815 32.3567C57.635 41.8057 49.3366 47.6817 38.4635 49.8192C37.5911 49.9903 36.7109 50.1473 35.8268 50.2285C34.4971 50.3508 33.1612 50.4005 31.3789 50.5077V50.5069Z'
                  fill='white'
               />
            </g>
            <defs>
               <clipPath id='clip0_1_836'>
                  <rect width='63.6947' height='61.9254' fill='white' />
               </clipPath>
            </defs>
         </svg>
      ),
   },
   {
      id: 'activities',
      label: 'OUR ACTIVITIES',
      img: pillimg3,
      icon: (
         <svg
            width='54'
            height='54'
            viewBox='0 0 54 54'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'>
            <g clipPath='url(#clip0_1_861)'>
               <path
                  d='M26.5805 53.7777C25.8028 53.7746 25.2671 53.2823 25.187 52.4798C24.8287 48.8933 24.0685 45.3927 22.9511 41.9675C20.8207 35.4367 17.5698 29.4861 13.5919 23.9135C11.1932 20.553 8.55242 17.3916 5.71622 14.3925C4.90233 13.5315 4.84907 12.5175 5.57609 11.7967C6.22296 11.1555 7.07253 11.049 7.83626 11.6395C9.20808 12.7001 10.5535 13.7968 11.8705 14.9246C14.1364 16.8647 16.3645 18.8492 19.0177 20.2691C24.7258 23.3241 30.2999 22.9259 35.6 19.3766C37.9321 17.8151 40.018 15.8853 42.2151 14.1215C43.2011 13.3299 44.165 12.5077 45.1759 11.7486C46.1283 11.0335 47.0524 11.1281 47.7256 11.9275C48.3285 12.6437 48.222 13.5895 47.4526 14.4054C41.956 20.2371 37.204 26.6019 33.6015 33.7872C31.0704 38.8355 29.2528 44.1206 28.3448 49.7041C28.1943 50.6302 28.1033 51.5656 27.9917 52.4979C27.8965 53.2927 27.3644 53.7792 26.58 53.7766L26.5805 53.7777Z'
                  fill='white'
               />
            </g>
            <defs>
               <clipPath id='clip0_1_861'>
                  <rect width='53.2172' height='53.7777' fill='white' />
               </clipPath>
            </defs>
         </svg>
      ),
   },
];

const CONTENT: Record<
   ContentId,
   {badge: string; heading: string; body: string; label?: string}
> = {
   who: {
      badge: '?',
      heading: 'WHO ARE WE?',
      label: 'WHO ARE WE?',
      body: 'Lorem ipsum dolor sit amet consectetur. Sed facilisis ac blandit lorem sed tincidunt pellentesque. Lorem ipsum dolor sit amet consectetur amet dolor sit amet consectetur adipiscing elit sed do eiusmod tempor.',
   },
   mission: {
      badge: 'M',
      heading: 'OUR MISSION',
      body: 'We work to ensure safe, reliable and sustainable LPG autogas usage across Bangladesh through strong regulations, modern infrastructure and member support.',
   },
   vision: {
      badge: 'V',
      heading: 'OUR VISION',
      body: 'To build a cleaner, greener future where LPG autogas is a trusted solution for transport and industry, reducing emissions and improving air quality nationwide.',
   },
   activities: {
      badge: 'A',
      heading: 'OUR ACTIVITIES',
      body: 'We arrange trainings, awareness programs, technical workshops and policy dialogues to help our members maintain world-class safety and service standards.',
   },
};

function ExpandedCardOverlay({
   badge,
   heading,
   body,
}: {
   badge: string;
   heading: string;
   body: string;
}) {
   return (
      <div className='absolute inset-x-0 bottom-0 w-full bg-[#228759da] px-4 sm:px-6 pb-6 pt-5'>
         <div className='pointer-events-none absolute inset-0 z-[0]'>
            <Image
               fill
               src={maskgridbg}
               alt='background'
               className='object-cover'
            />
         </div>

         <div className='relative z-[1] w-full text-white'>
            <div className='flex items-center gap-2'>
               <div className='flex h-7 w-7 items-center justify-center rounded-full border border-white/60 bg-white/10 text-[13px] font-semibold'>
                  {badge}
               </div>
               <p className='text-[18px] sm:text-[22px] font-bold uppercase tracking-[0.18em]'>
                  {heading}
               </p>
            </div>

            <p className='mt-3 text-[14px] sm:text-[15px] leading-relaxed text-white/90'>
               {body}
            </p>

            <button
               type='button'
               onClick={e => e.stopPropagation()}
               className='mt-4 inline-flex items-center gap-2 rounded-full border border-[#46FF5B66] bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors hover:bg-white hover:text-[#009F6B]'>
               Learn more
            </button>
         </div>
      </div>
   );
}

function CollapsedPill({
   icon,
   label,
   bg,
}: {
   icon: ReactNode;
   label: string;
   bg: StaticImageData | string;
}) {
   return (
      <>
         <div className='pointer-events-none absolute inset-0 z-[0] opacity-60'>
            <Image fill src={bg} alt={label} className='object-cover' />
         </div>

         <div className='pointer-events-none absolute inset-0 z-[1] opacity-90'>
            <Image fill src={minigridbg} alt={label} className='object-cover' />
         </div>

         <div className='pointer-events-none absolute inset-[1px] z-[2] rounded-[24px] bg-[linear-gradient(180deg,#16C17C33_0%,transparent_40%,#00693F66_100%)]' />

         <div className='absolute top-4 sm:top-5 left-1/2 z-[3] flex -translate-x-1/2 items-center justify-center rounded-full bg-white/10 p-2'>
            {icon}
         </div>

         <p className='relative z-[3] text-[18px] sm:text-[22px] font-bold tracking-[0.05em] text-white [writing-mode:vertical-rl] rotate-180'>
            {label}
         </p>
      </>
   );
}

export default function WhyChooseUsSection() {
   const [activeId, setActiveId] = useState<ContentId>('who');

   const activeContent = useMemo(() => CONTENT[activeId], [activeId]);

   const activePillId = activeId === 'who' ? null : activeId;

   const pillsGridTemplate = useMemo(() => {
      const collapsed = '145px';
      if (!activePillId) return PILL_ITEMS.map(() => collapsed).join(' ');
      return PILL_ITEMS.map(p =>
         p.id === activePillId ? 'minmax(0, 1fr)' : collapsed
      ).join(' ');
   }, [activePillId]);

   return (
      <section className='relative w-full my-12 md:py-16'>
         <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_#E1F4E880,_transparent_70%)]' />

         <div className='lpg-container relative'>
            <SectionHeading
               title='WHY CHOOSE US'
               subtitle='Lorem ipsum dolor sit amet consectetur. Urna ultrices amet ultrices sagittis leo in. In urna fermentum nunc sapien tortor.'
            />

            <div className='mt-10 flex flex-col gap-6 lg:min-h-[570px] lg:flex-row lg:gap-6'>
               {/* LEFT PANEL (WHO) — mobile: always expanded. desktop: expands/collapses like accordion */}
               <div
                  onClick={() => setActiveId('who')}
                  className={[
                     'relative overflow-hidden rounded-[15px] shadow-[0_22px_40px_rgba(0,0,0,0.22)]',
                     'h-[420px] sm:h-[520px] lg:h-auto',
                     'w-full',
                     'cursor-pointer',
                     'transition-[width] duration-500 ease-out',
                     activeId === 'who' ? 'lg:w-[700px]' : 'lg:w-[145px]',
                  ].join(' ')}>
                  {/* Mobile: keep old behavior (always expanded card) */}
                  <div className='absolute inset-0 lg:hidden'>
                     <Image
                        src={stationIllustration}
                        alt='Modern LPG station illustration'
                        fill
                        priority
                        className='object-cover'
                     />
                     <ExpandedCardOverlay
                        badge={activeContent.badge}
                        heading={activeContent.heading}
                        body={activeContent.body}
                     />
                  </div>

                  {/* Desktop expanded */}
                  {activeId === 'who' && (
                     <div className='hidden lg:block absolute inset-0'>
                        <Image
                           src={stationIllustration}
                           alt='Modern LPG station illustration'
                           fill
                           priority
                           className='object-cover'
                        />
                        <ExpandedCardOverlay
                           badge={CONTENT.who.badge}
                           heading={CONTENT.who.heading}
                           body={CONTENT.who.body}
                        />
                     </div>
                  )}

                  {/* Desktop collapsed (strip) */}
                  {activeId !== 'who' && (
                     <div className='hidden lg:flex absolute inset-0 items-center justify-center'>
                        <CollapsedPill
                           icon={InfoIcon}
                           label={CONTENT.who.label ?? CONTENT.who.heading}
                           bg={stationIllustration}
                        />
                     </div>
                  )}
               </div>

               {/* RIGHT PILLS */}
               <div
                  className={[
                     'flex w-full flex-1 gap-3 overflow-x-auto pb-2',
                     'lg:grid lg:overflow-hidden lg:pb-0',
                     '-mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0',
                     'snap-x snap-mandatory',
                  ].join(' ')}
                  style={{gridTemplateColumns: pillsGridTemplate}}>
                  {PILL_ITEMS.map(pill => {
                     const isExpandedDesktop = activeId === pill.id;
                     const content = CONTENT[pill.id];

                     return (
                        <div
                           key={pill.id}
                           onClick={() => setActiveId(pill.id)}
                           className={[
                              'relative flex shrink-0 snap-center cursor-pointer items-center justify-center overflow-hidden rounded-[15px]',
                              'bg-gradient-to-b from-[#00b06d30] via-[#00A261] to-[#00894e32]',
                              'shadow-[0_22px_36px_rgba(0,0,0,0.22)]',
                              'transition-all duration-500 ease-out',
                              'h-[360px] w-[110px] sm:h-[370px] sm:w-[160px] md:h-[380px] md:w-[145px]',
                              'lg:h-full lg:w-auto',
                              isExpandedDesktop
                                 ? 'lg:ring-2 lg:ring-[#46FF5B66]'
                                 : '',
                           ].join(' ')}>
                           {/* MOBILE/TABLET: always collapsed pills (left card changes content) */}
                           <div className='lg:hidden absolute inset-0 flex items-center justify-center'>
                              <CollapsedPill
                                 icon={pill.icon}
                                 label={pill.label}
                                 bg={pill.img}
                              />
                           </div>

                           {/* DESKTOP: collapsed vs expanded like video */}
                           {!isExpandedDesktop ? (
                              <div className='hidden lg:flex absolute inset-0 items-center justify-center'>
                                 <CollapsedPill
                                    icon={pill.icon}
                                    label={pill.label}
                                    bg={pill.img}
                                 />
                              </div>
                           ) : (
                              <div className='hidden lg:block absolute inset-0'>
                                 <Image
                                    fill
                                    src={stationIllustration}
                                    alt={pill.label}
                                    className='object-cover'
                                    priority={pill.id === 'mission'}
                                 />
                                 <ExpandedCardOverlay
                                    badge={content.badge}
                                    heading={content.heading}
                                    body={content.body}
                                 />
                              </div>
                           )}
                        </div>
                     );
                  })}
               </div>
            </div>
         </div>
      </section>
   );
}

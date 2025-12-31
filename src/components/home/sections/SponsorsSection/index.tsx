'use client';

import Image, {type StaticImageData} from 'next/image';
import {Direction} from './FramerMarqueeRow';

import leaderImg1 from '@/assets/leader-img/SayedSajjadulKarimKabul.jpeg';
import leaderImg2 from '@/assets/leader-img/MirAhasanUddinFarvez.jpeg';
import folio1 from '@/assets/Bento_Grid (7).png';
import folio2 from '@/assets/Bento_Grid (8).png';
import sponserImg1 from '@/assets/sponser-img/mgi.png';
import laugfs from '@/assets/sponser-img/laugfs.png';
import promita from '@/assets/sponser-img/promita.png';
import total from '@/assets/sponser-img/total.png';
import omera from '@/assets/sponser-img/omera.png';
import jsjvl from '@/assets/sponser-img/jsjvl.png';
import navama from '@/assets/sponser-img/navama.png';
import ggas from '@/assets/sponser-img/ggas.png';
import beximco from '@/assets/sponser-img/beximco.png';
import prtromax from '@/assets/sponser-img/prtromax.png';
import universal from '@/assets/sponser-img/universal.png';



import arrowuiIcon from '@/assets/ui-icons/Layer_1 (3).png';
import SectionHeading from '@components/ui/SectionHeading';
import FramerMarqueeRow from './FramerMarqueeRow';

export type Sponsor = {
   name: string;
   logo: StaticImageData | string;
};

type Leader = {
   name: string;
   title: string;
   lines?: string[];
   bio: string;
   photo: StaticImageData;
};

const sponsors: Sponsor[] = [
   {name: 'MGI', logo: sponserImg1},
   {name: 'Laugfs Gas', logo: laugfs},
   {name: 'Promita LPG', logo: promita},
   {name: 'Total', logo: total},
   {name: 'Omera', logo: omera},
   {name: 'Jsjvl', logo: jsjvl},

   {name: 'Navana LPG', logo: navama},
   {name: 'G Gas', logo: ggas},
   {name: 'Beximco LPG', logo: beximco},
   {name: 'Petromax LPG', logo: prtromax},
   {name: 'Universal Gas', logo: universal},
];

const leaders: Leader[] = [
   {
      name: 'Sayed Sajjadul Karim Kabul',
      title: 'PRESIDENT',
      // lines: [
      //    'Mechanical Engineer, BUET',
      //    'Managing Director, Saad Motors Ltd.',
      //    'Managing Director, SMT Energy Ltd.',
      // ],
      bio: `Liquefied Petroleum Gas (Autogas) has gained global popularity 
as an alternative clean fuel. Bangladesh has also adopted this fuel 
to reduce emissions and reliance on traditional energy sources. 
Our association works to ensure safe and efficient autogas usage 
across the country, supporting members through policy, training 
and technical guidance.`,
      photo: leaderImg1,
   },
   {
      name: 'Mir Ahasan Uddin Farvez',
      title: 'Member SECRETARY',
      // lines: [
      //    'CEO, Green Fuel Technologies Ltd.',
      //    'Prop. Green Fuel CNG & LPG Conversion Center',
      //    'Managing Director at Green Distribution Energy Services Ltd.',
      // ],
      bio: `LPG is a clean-burning and cost-effective energy value and 
environment friendly. The association helps members to maintain 
highest safety standards, technical excellence and regulatory 
compliance while expanding autogas services across Bangladesh.`,
      photo: leaderImg2,
   },
];

export default function SponsorsSection() {
   const sponsorRows: {
      items: Sponsor[];
      direction: Direction;
      durationSec: number;
   }[] = [
      {
         // 1st row → 2 logos (index 0–1)
         direction: 'right',
         items: sponsors.slice(0, 2),
         durationSec: 6,
      },
      {
         // 2nd row → 4 logos (index 2–5)
         direction: 'left',
         items: sponsors.slice(2, 6),
         durationSec: 10,
      },
      {
         // 3rd row → 5 logos (index 6–10)
         direction: 'right',
         items: sponsors.slice(6, 11),
         durationSec: 15,
      },
   ];

   return (
      <section className='relative z-0 pb-20 pt-12'>
         {/* top green line */}
         <div className='pointer-events-none absolute inset-x-0 top-0 h-4' />

         <div className='relative flex flex-col gap-44'>
            {/* sponsors title + marquee */}
            <div className='relative flex w-full flex-col items-center text-center'>
               {/* side leaves */}
               <div className='pointer-events-none absolute inset-y-0 left-0 hidden w-[330px] lg:block'>
                  <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,_#75B5534d,_transparent_70%)]' />
                  <Image src={folio1} alt='' fill className='object-contain' />
               </div>

               <div className='pointer-events-none absolute inset-y-0 right-0 hidden w-[330px] lg:block'>
                  <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,_#75B5534d,_transparent_70%)]' />
                  <Image src={folio2} alt='' fill className='object-contain' />
               </div>

               <div className='lpg-container'>
                  <SectionHeading
                     title=' SPONSORS'
                     subtitle=' Lorem ipsum dolor sit amet consectetur. Ultrices volutpat sollicitudin quis at in. In urna fermentum nunc sapien tortor.'
                  />

                  <div className='mt-7 flex flex-col items-center gap-4'>
                     {sponsorRows.map((row, rowIndex) => (
                        <FramerMarqueeRow
                           key={rowIndex}
                           items={row.items}
                           direction={row.direction}
                           durationSec={row.durationSec}
                           className={rowIndex > 0 ? 'mt-1' : ''}
                        />
                     ))}
                  </div>
               </div>
            </div>

            {/* leaders cards */}
            <div className='relative'>
               <div className='pointer-events-none absolute inset-y-0 -top-1/2 left-0 hidden w-[330px] opacity-10 lg:block'>
                  <Image
                     src={arrowuiIcon}
                     alt=''
                     fill
                     className='object-contain'
                  />
               </div>
               <div className='pointer-events-none absolute inset-y-0 -top-1/2 right-0 hidden w-[330px] -scale-x-100 transform opacity-10 lg:block'>
                  <Image
                     src={arrowuiIcon}
                     alt=''
                     fill
                     className='object-contain'
                  />
               </div>

               <div className='lpg-container relative mt-24 grid items-center justify-center gap-6 lg:grid-cols-2'>
                  {leaders.map(leader => (
                     <article
                        key={leader.name}
                        className='relative min-h-[520px] w-full max-w-[480px] place-self-center overflow-visible rounded-t-[98px] rounded-b-[12px] border-[4px] border-[#CCD2F4] bg-white/95 px-6 pb-7 pt-10 shadow-[0_18px_40px_rgba(0,0,0,0.06)] md:min-h-[620px]'>
                        {/* photo circle */}
                        <div className='absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/3'>
                           <div className='flex h-[200px] w-[200px] items-center justify-center rounded-full bg-[#CCD2F4] p-[4px] sm:h-[240px] sm:w-[240px] lg:h-[270px] lg:w-[270px]'>
                              <div className='relative h-full w-full overflow-hidden rounded-full bg-white'>
                                 <Image
                                    src={leader.photo}
                                    alt={leader.name}
                                    fill
                                    className='object-contain'
                                 />
                              </div>
                           </div>
                        </div>

                        <div className='mt-38 text-center'>
                           <h3 className='text-[24px] font-extrabold uppercase'>
                              {leader.title}
                           </h3>
                           <p className='mt-1 text-[20px] font-medium'>
                              {leader.name}
                           </p>

                           <div className='mt-2 space-y-2 text-[15px] font-light'>
                              {leader.lines && leader.lines.map(line => (
                                 <div
                                    className='font-light opacity-80'
                                    key={line}>
                                    {line}
                                 </div>
                              ))}
                           </div>

                           <p className='mt-20 text-[15px] leading-relaxed opacity-80'>
                              {leader.bio}
                           </p>
                        </div>
                     </article>
                  ))}
               </div>
            </div>
         </div>
      </section>
   );
}

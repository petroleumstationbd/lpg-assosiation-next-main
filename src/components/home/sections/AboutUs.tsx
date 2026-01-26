'use client';

import {useEffect, useMemo, useState} from 'react';
import Image, {StaticImageData} from 'next/image';
import {animate, useMotionValue} from 'framer-motion';

import aboutImg from './../img/Group 46.png';
import SectionHeading from '@components/ui/SectionHeading';
import iconImg1 from './../img/Group 360.png';
import iconImg2 from './../img/Group 51.png';
import subtrackImg from '@assets/wrappers/Subtract.png';
import objectanimation from './../../../assets/ui-icons/OBJECTS.png';

type VisionStat = {
   icon: StaticImageData;
   label: string;
   value: number;
};

export default function AboutUsSection() {
   const [totalMembers, setTotalMembers] = useState(0);
   const [totalStations, setTotalStations] = useState(0);

   useEffect(() => {
      const fetchStats = async () => {
         try {
            const [stationsResponse, membersResponse] = await Promise.all([
               fetch(
                  'https://admin.petroleumstationbd.com/api/public/gas-stations/approved',
               ),
               fetch(
                  'https://admin.petroleumstationbd.com/api/public/station-owners/list',
               ),
            ]);

            if (stationsResponse.ok) {
               const stationsData = await stationsResponse.json();
               const total = Number(stationsData?.total);
               if (Number.isFinite(total)) {
                  setTotalStations(total);
               }
            }

            if (membersResponse.ok) {
               const membersData = await membersResponse.json();
               const total = Number(membersData?.total);
               if (Number.isFinite(total)) {
                  setTotalMembers(total);
               }
            }
         } catch (error) {
            console.error('Failed to load about section stats', error);
         }
      };

      fetchStats();
   }, []);

   const visionStats: VisionStat[] = useMemo(
      () => [
         {
            icon: iconImg1,
            label: 'TOTAL MEMBERS',
            value: totalMembers,
         },
         {
            icon: iconImg2,
            label: 'Petrol Pump station',
            value: totalStations,
         },
      ],
      [totalMembers, totalStations],
   );

   return (
      <section className='relative  md:py-16'>
         <div className='lpg-container relative'>
            <div className='mb-10 text-center'>
               <SectionHeading title=' ABOUT US' />
               <h2 className='text-[22px] font-semibold tracking-[0.22em] text-[#203566]'></h2>
               <p className='mt-2 text-[12px] leading-relaxed text-[#7B8EA5]'>
                  Bangladesh Petroleum Dealer's, Distributor's, Agent's & Petrol
                  Pump Owner's Association is a nationally representative
                  organization that serves as a unified platform for
                  entrepreneurs and stakeholders engaged in the petroleum fuel
                  distribution system of Bangladesh. The Association is
                  committed to safeguarding the legitimate rights of its
                  members, ensuring safe and consumer-friendly fuel services,
                  and supporting the implementation of government energy
                  policies.
               </p>
            </div>

            <div className='grid gap-10 items-start lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]'>
               <div className='max-w-xl'>
                  <div className='mt-7 grid gap-4 place-items-center sm:grid-cols-2 sm:place-items-start'>
                     {visionStats.map((stat, idx) => (
                        <VisionStatCard key={idx} {...stat} />
                     ))}
                  </div>
               </div>

               <div className='relative mx-auto mt-6  w-full max-w-[580px] items-center justify-center lg:mt-0 hidden lg:flex'>
                  <div className='relative w-full overflow-hidden rounded-[26px] '>
                     <Image
                        src={aboutImg}
                        alt='LPG autogas station illustration'
                        width={720}
                        height={480}
                        className='h-auto w-full object-cover'
                        priority
                     />
                  </div>
               </div>
            </div>
         </div>

         <div className='absolute -left-[0.1%] -bottom-[120px] z-0 h-[320px] md:-bottom-[160px] md:h-[420px] lg:h-[550px]'>
            <Image
               src={objectanimation}
               alt=''
               className='object-contain h-full w-[100%] opacity-35 rotate-180 scale-[1.2]'
            />
         </div>
      </section>
   );
}

function VisionStatCard({icon, label, value}: VisionStat) {
   return (
      <article
         className='
        relative flex min-h-[220px] w-full max-w-[220px] flex-col
        overflow-hidden
        rounded-[22px] sm:min-h-[250px] '>
         <div className='absolute -top-6 -right-6 inset-1 z-1'>
            <Image src={subtrackImg} fill alt='' />
         </div>

         <div
            className='
          pointer-events-none
          absolute right-1 top-0
          h-[64px] w-[150px] rounded-[40px]
          bg-[#75B551] z-0'
         />

         <div className='relative flex flex-1 flex-col px-7 pt-7 pb-6 z-2'>
            <div className='h-[76px] w-[76px]'>
               <Image
                  src={icon}
                  alt={label}
                  className='h-full w-full object-contain drop-shadow-[0_18px_26px_rgba(0,176,109,0.55)]'
               />
            </div>

            <div className='mt-auto'>
               <p className='text-[14px] font-semibold uppercase tracking-[0.0em] '>
                  {label}
               </p>
               <p className='mt-2 text-[50px] font-semibold leading-none '>
                  <AnimatedCounter value={value} />
               </p>
            </div>
         </div>
      </article>
   );
}

function AnimatedCounter({value}: {value: number}) {
   const mv = useMotionValue(0);
   const [display, setDisplay] = useState('0');

   useEffect(() => {
      const controls = animate(mv, value, {
         duration: 1.2,
         ease: 'easeOut',
      });

      const unsub = mv.on('change', (latest) => {
         const rounded = Math.max(0, Math.round(latest));
         setDisplay(rounded.toLocaleString());
      });

      return () => {
         controls.stop();
         unsub();
      };
   }, [mv, value]);

   return <span>{display}</span>;
}

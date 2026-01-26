'use client';
// import autogasLogo from '@/assets/partner-logos/autogas.png';
// import bashundharaLogo from '@/assets/partner-logos/bashundaralp.png';
// import bmlpgLogo from '@/assets/partner-logos/bmlp.png';
// import gftlLogo from '@/assets/partner-logos/gftl.png';
// import greenlpgLogo from '@/assets/partner-logos/greenlp.png';
// import mrclLogo from '@/assets/partner-logos/mrcl.png';
// import orionLogo from '@/assets/partner-logos/onion.png';
// import soibalLogo from '@/assets/partner-logos/soiballogo.png';

import Bangladesh_Petroleum_Corporation from '@/assets/partner-logos/Bangladesh_Petroleum_Corporation.svg.png';
import Meghna_Petroleum_Limited_Logo from '@/assets/partner-logos/Meghna_Petroleum_Limited_Logo.png';
import padma from '@/assets/partner-logos/পদ্মা_অয়েল_কোম্পানীর_লোগো.svg.png';
import jamuna from '@/assets/partner-logos/যমুনা_অয়েল_কোম্পানী_লিমিটেড_এর_লোগো.jpeg';

import SectionHeading from '@components/ui/SectionHeading';
import {LogoCard, type LogoItem} from '@components/ui/LogoCard';
const partners: LogoItem[] = [
   // {name: 'Autogas', logo: autogasLogo},
   // {name: 'Orion Gas', logo: orionLogo},
   // {name: 'Green Fuel Technologies Ltd.', logo: gftlLogo},
   // {name: 'Bashundhara LP Gas', logo: bashundharaLogo},
   // {name: 'MRCL LPG', logo: mrclLogo},
   // {name: 'BM LP Gas', logo: bmlpgLogo},
   // {name: 'JMI Autogas', logo: soibalLogo},
   // {name: 'Green LP Gas', logo: greenlpgLogo},

   {
      name: 'Bangladesh Petroleum Corporation (BPC)',
      logo: Bangladesh_Petroleum_Corporation,
   },
   {name: 'Meghna Petroleum Limited (MEGP)', logo: Meghna_Petroleum_Limited_Logo},
   {name: 'Padma Oil Company Limited (POCL)', logo: padma},
   {name: 'Jamuna Oil Company Limited (JOCL)', logo: jamuna},
];
export default function OurPartnersSection() {
   return (
      <section className='relative overflow-hidden py-32'>
         {' '}
         {/* side glows */}{' '}
         <div className='pointer-events-none absolute left-[-160px] top-1/2 hidden h-[260px] w-[360px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,_#75B5534F,_transparent_70%)] lg:block' />{' '}
         <div className='pointer-events-none absolute right-[-160px] top-1/2 hidden h-[260px] w-[360px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,_#75B5534F,_transparent_70%)] lg:block' />{' '}
         {/* center soft glow behind cards */}{' '}
         {/* <div className="pointer-events-none absolute inset-x-[10%] top-[48%] h-[260px] -translate-y-1/2 rounded-[999px] bg-[radial-gradient(circle_at_center,_#E1F4E880,_transparent_70%)]" /> */}{' '}
         <div className='lpg-container relative'>
            {' '}
            <SectionHeading
               title='OUR PARTNERS'
               subtitle='We work with trusted partners who share our commitment to quality, safety, innovation, and sustainable growth in the petroleum sector.'
            />{' '}
            <div className='mt-8 rounded-[26px]'>
               {' '}
               <div className='grid gap-5 md:grid-cols-2 lg:grid-cols-4'>
                  {' '}
                  {partners.map(partner => (
                     <LogoCard key={partner.name} {...partner} />
                  ))}{' '}
               </div>{' '}
            </div>{' '}
         </div>{' '}
      </section>
   );
}

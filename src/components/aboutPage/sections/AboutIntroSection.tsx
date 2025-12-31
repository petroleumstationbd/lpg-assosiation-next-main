import Image from 'next/image';
import associationLogo from '@assets/logo/logo-association.png';

const AboutIntroSection = () => {
   return (
      <section className='relative py-12 md:py-32'>
         {/* side glows */}
         <div className='pointer-events-none absolute left-[-160px] top-1/2 hidden h-[460px] w-[560px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,_#75B5534F,_transparent_70%)] lg:block' />
         <div className='pointer-events-none absolute right-[-160px] top-1/2 hidden h-[460px] w-[560px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,_#75B5534F,_transparent_70%)] lg:block' />
         <div className='lpg-container relative flex flex-col items-center gap-10 lg:flex-row'>
            {/* LEFT: circular logo */}
            <div className='flex w-full justify-center md:justify-start lg:w-[540px]'>
               <Image
                  src={associationLogo}
                  alt='Association logo'
                  className='h-[240px] w-[240px] object-contain sm:h-[320px] sm:w-[320px] lg:h-[520px] lg:w-[520px]'
               />
            </div>

            {/* RIGHT: heading + text */}
            <div className='w-full space-y-3 md:space-y-4 lg:w-[60%]'>
               <h2 className='text-[22px] md:text-[16px] font-semibold uppercase '>
                  BANGLADESH LPG AUTOGAS STATION &amp; CONVERSION
                  <br className='hidden md:block' />
                  WORKSHOP OWNERS&apos; ASSOCIATION
               </h2>

               <p className='text-[15px] leading-relaxed '>
                  Bangladesh LPG Autogas Station &amp; Conversion Workshop
                  Owners&apos; Association is a national platform of LPG Autogas
                  station and conversion workshop owners actively working in
                  Bangladesh. Our organisation works to ensure development and
                  safety in every stage of LPG Autogas operations.
               </p>

               <p className='text-[15px] leading-relaxed '>
                  The Association works closely with the Government, policy
                  makers and all stakeholders to support safe and modern LPG
                  infrastructure, improve service quality and protect consumer
                  interests.
               </p>

               <p className='text-[15px] leading-relaxed '>
                  Through training, guidelines and regular communication, we
                  help our members maintain compliance with the latest rules and
                  standards and promote an efficient, safe and sustainable LPG
                  Autogas sector across the country.
               </p>
            </div>
         </div>
      </section>
   );
};

export default AboutIntroSection;

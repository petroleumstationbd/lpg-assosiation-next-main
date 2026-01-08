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
                  Bangladesh petroleum dealer's Distributor's Agent's &
                  <br className='hidden md:block' />
                  Petrol Pump Owner's Association
               </h2>

               <p className='text-[15px] leading-relaxed '>
                  The energy sector plays a vital and strategic role in
                  sustaining Bangladesh’s economic growth and overall
                  development. The uninterrupted supply of petroleum fuels is
                  essential for industry, agriculture, transportation, and daily
                  life, making fuel distribution a cornerstone of national
                  progress. Petroleum dealers, distributors, agents, and petrol
                  pump owners across the country have long been working
                  tirelessly to ensure this continuous supply.
               </p>

               <p className='text-[15px] leading-relaxed '>
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

               <p className='text-[15px] leading-relaxed '>
                  In the context of changing global energy dynamics, limited
                  domestic resources, and growing demand, the importance of
                  sustainable and alternative fuel solutions has increased
                  significantly. In response, the Association actively
                  collaborates with the government, regulatory authorities, and
                  relevant stakeholders to promote a modern, transparent, and
                  sustainable fuel distribution system.
               </p>
               <p className='text-[15px] leading-relaxed '>
                  With a strong sense of responsibility toward national energy
                  security, investment protection, and ethical business
                  practices, the Association remains dedicated to contributing
                  constructively to the development of Bangladesh’s petroleum
                  and energy sector, both now and in the future.
               </p>
            </div>
         </div>
      </section>
   );
};

export default AboutIntroSection;

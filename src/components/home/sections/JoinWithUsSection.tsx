'use client';

import Image from 'next/image';

// update these paths/names to your actual files
import joinGradientBg from './../img/Group 97 (1).png';
import joinLineArt from './../img/Group 86.png';

export default function JoinWithUsSection() {
   return (
      <section className='relative py-12'>
         <div className='w-full'>
            <div
               className='
            relative mx-auto
            min-h-[360px] w-full
            max-w-none
            sm:min-h-[420px]
            lg:min-h-[500px]
          '>
               {/* gradient blob with top/bottom curves */}
               <div className='relative h-full w-full overflow-hidden'>
                  <Image
                     src={joinGradientBg}
                     alt='Join with us gradient background'
                     fill
                     priority
                     className='object-cover'
                  />

                  {/* cyan line-art overlay (left + right) */}
                  <Image
                     src={joinLineArt}
                     alt=''
                     className='
                pointer-events-none object-cover
                mix-blend-screen opacity-60 px-0 pt-11
              '
                  />

                  {/* content centered on card */}
                  <div
                     className='
                absolute inset-0
                flex flex-col items-center justify-center
                text-center text-white lpg-container
              '>
                     <h2 className='text-[28px] font-medium tracking-[0.05em] sm:text-[34px] lg:text-[45px]'>
                        JOIN WITH US
                     </h2>

                     <p className='mt-3 max-w-[720px] text-[12px] leading-relaxed text-[#EEEEEE]'>
                        Lorem ipsum dolor sit amet consectetur. Urna dolor amet
                        sed ultricies quis leo. In urna fermentum nunc sapien
                        tortor.
                     </p>

                     <div className='relative inline-flex mt-6'>
                        <button className='neon-pill rounded-full px-8 py-2 text-[11px] font-semibold tracking-[0.18em] uppercase text-white'>
                           GET STARTED
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
}

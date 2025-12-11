import PageHero from '@/components/shared/PageHero';

import aboutHero from './img/banner-bg.png';
import AboutIntroSection from './sections/AboutIntroSection';
import MissionVisionActivitiesSection from './sections/MissionVisionActivitiesSection';
import Footer from './../layout/Footer';

type InfoCardProps = {
   title: string;
   iconLabel: string;
   items: string[];
   variant?: 'default' | 'wide';
};

const InfoCard = ({
   title,
   iconLabel,
   items,
   variant = 'default',
}: InfoCardProps) => {
   return (
      <article
         className={[
            'relative overflow-hidden rounded-[18px] bg-white shadow-[0_18px_45px_rgba(0,0,0,0.08)]',
            variant === 'wide' ? 'md:col-span-2' : '',
         ].join(' ')}>
         {/* top accent strip + tab */}
         <div className='h-[9px] w-full bg-[#6CC12A]' />
         <div className='absolute right-6 top-[9px] h-7 w-24 rounded-b-[18px] bg-[#E6F8D9]' />

         <div className='px-6 pb-7 pt-7 md:px-8 md:pb-9 md:pt-9'>
            <div className='mb-3 flex items-center gap-3 md:mb-4'>
               <div className='flex h-10 w-10 items-center justify-center rounded-full bg-[#F5FBF5] text-xl'>
                  <span aria-hidden='true'>{iconLabel}</span>
               </div>
               <h3 className='text-lg font-semibold text-[#003B4A] md:text-xl'>
                  {title}
               </h3>
            </div>

            <ul className='space-y-2 text-sm leading-relaxed text-[#23425A] md:text-[15px]'>
               {items.map((item, idx) => (
                  <li key={idx} className='flex gap-2'>
                     <span className='mt-1 h-[6px] w-[6px] flex-shrink-0 rounded-full bg-[#6CC12A]' />
                     <span>{item}</span>
                  </li>
               ))}
            </ul>
         </div>
      </article>
   );
};

export default function AboutPage() {
   return (
      <div className='relative  text-[#003B4A]'>
         <PageHero
            title='About us'
            backgroundImage={aboutHero}
            height='compact'
         />

         <AboutIntroSection />
         <MissionVisionActivitiesSection />

          <Footer /> 
      </div>
   );
}

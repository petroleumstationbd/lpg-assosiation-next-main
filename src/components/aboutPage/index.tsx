import PageHero from '@/components/shared/PageHero';

import aboutHero from './img/banner-bg.png';
import AboutIntroSection from './sections/AboutIntroSection';
import MissionVisionActivitiesSection from './sections/MissionVisionActivitiesSection';
import Footer from './../layout/Footer';



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

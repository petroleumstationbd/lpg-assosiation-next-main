import PageHero from '@/components/shared/PageHero';
import Footer from '@/components/layout/Footer';
import AlbumCard, {type Album} from '@/components/news/AlbumCard';

import newsHero from '@assets/newsfeed-img/banner.png';
import album1 from '@assets/newsfeed-img/gallery.png';
import album2 from '@assets/newsfeed-img/gallery.png';
import album3 from '@assets/newsfeed-img/gallery.png';
import AlbumsHeroSliderSection from './sections/AlbumsHeroSliderSection';

const albums: Album[] = [
   {
      id: '1',
      title: 'GENERAL MEETING',
      date: 'MARCH 2024',
      image: album1,
      description:
         'Highlights from the general meeting with association members.',
   },
   {
      id: '2',
      title: 'BUDGET MEETING',
      date: 'FEBRUARY 2024',
      image: album2,
      description: 'Discussion on sector development and upcoming initiatives.',
   },
   {
      id: '3',
      title: 'PRESS BRIEFING',
      date: 'JANUARY 2024',
      image: album3,
      description: 'Press briefing on LPG safety and regulatory updates.',
   },
];

const NewsFeedPage = () => {
   return (
      <main className='relative  text-[#003B4A]'>
         <PageHero
            title='News Feed'
            subtitle='Updates, events and media from Bangladesh LPG Autogas Station & Conversion Workshop Owners’ Association'
            backgroundImage={newsHero}
            height='compact'
         />

         <AlbumsHeroSliderSection />
         {/* top selector cards */}
         <section className='relative bg-[linear-gradient(180deg,#F6FCF7_0%,#EDF8F1_100%)] pb-16 pt-10 md:pb-24 md:pt-14'>
            <div className='lpg-container space-y-8 md:space-y-10'>
               {/* heading */}
               <div className='text-center'>
                  <h2 className='text-[22px] font-semibold text-[#003B4A] md:text-[26px]'>
                     Our Albums
                  </h2>
                  <p className='mt-2 text-[13px] text-[#5A6B7B] md:text-[14px]'>
                     Explore recent meetings, seminars, workshops and other
                     association activities.
                  </p>
               </div>

               {/* albums grid */}
               <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                  {albums.map(album => (
                     <AlbumCard key={album.id} album={album} />
                  ))}
               </div>
            </div>
         </section>

         <Footer />
      </main>
   );
};

export default NewsFeedPage;

import PageHero from '@/components/shared/PageHero';
import Footer from '@/components/layout/Footer';
import JournalsSection from '@/components/journals/JournalsSection';
import heroBg from '@assets/newsfeed-img/banner.png';

export default function JournalsPage() {
  return (
    <div>
      <PageHero title="Print Media Gallery" backgroundImage={heroBg} height="compact" />
      <JournalsSection />
      <Footer />
    </div>
  );
}

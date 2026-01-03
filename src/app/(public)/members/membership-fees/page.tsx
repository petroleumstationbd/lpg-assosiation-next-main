import PageHero from '@/components/shared/PageHero';
import Footer from '@/components/layout/Footer';

import heroBg from '@/assets/newsfeed-img/banner.png';
import MembershipFeesSection from '@/components/members/MembershipFeesSection';

export default function MembershipFeesPage() {
  return (
    <div>
      <PageHero
        title="Members"
        subtitle="Lorem ipsum dolor sit amet consectetur. Neque aliquam amet commodo sollicitudin"
        backgroundImage={heroBg}
        height="compact"
      />

      <MembershipFeesSection />

      <Footer />
    </div>
  );
}

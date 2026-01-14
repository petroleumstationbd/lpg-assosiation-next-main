import PageHero from '@/components/shared/PageHero';
import Footer from '@/components/layout/Footer';

import heroBg from '@/assets/newsfeed-img/banner.png';
import RegisterSection from '@/components/auth/RegisterSection';
import RegisterOwnerSection from '@/features/dashboard/owners/register-owner/RegisterOwnerSection';

export default function RegisterPage() {
  return (
    <div>
      <PageHero
        title="Register"
        // subtitle="Lorem ipsum dolor sit amet consectetur. Neque aliquam amet commodo sollicitudin"
        backgroundImage={heroBg}
        height="compact"
      />

      {/* <RegisterSection /> */}


      <RegisterOwnerSection />

      <Footer />
    </div>
  );
}

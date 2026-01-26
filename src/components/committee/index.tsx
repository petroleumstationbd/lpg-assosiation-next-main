import CentralCommitteeSection from '@components/shared/CentralCommitteeSection';
import PageHero from '@/components/shared/PageHero';
import newsHero from '@assets/bg-img/committee-banner-img.png';
import Footer from '@/components/layout/Footer';

export default function CentralCommitteePage() {
   return (
      <div>
         <PageHero
            //             title='Committee'
            //             subtitle='The present committee was formed in a general meeting held on January 1, 2000. The meeting was chaired by Syed Sajjadul Karim Kabul and was attended by about 200 petrol pump station owners and various individuals. Syed Sajjadul Karim Kabul, Mir Ahsan Uddin Parvez and a 41-member panel are running the present committee. The following panel members are playing an important role in promoting the Bangladesh Petroleum Dealers, Distributors, Agents and Petrol Pump Owners Association throughout the country as the general secretaries of this association.
            // '
            // backgroundImage={newsHero}
            height='compact'
         />

         <CentralCommitteeSection />

         <Footer />
      </div>
   );
}

import PageHero from '@/components/shared/PageHero';
import Footer from '@/components/layout/Footer';
import heroImg from '@assets/bg-img/starlink-banner.png';
import ContactUsWithForm from '../../../components/shared/ContactSectionWithForm/index';

export default function ContactPage() {
   return (
      <div>
         <PageHero
            title='Contact Us'
            subtitle="Welcome to Bangladesh petroleum dealer's Distributor's Agent's &
Petrol Pump Owner's Association.

We warmly welcome you to our Contact Us page. If you have any questions, inquiries, or need further information about our association, please do not hesitate to contact us. We value your feedback and look forward to assisting you"
            backgroundImage={heroImg}
            height='compact'
         />

         <div className='lpg-container'>
            <ContactUsWithForm />
         </div>

         <Footer />
      </div>
   );
}

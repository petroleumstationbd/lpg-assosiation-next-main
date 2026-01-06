'use client';

import ContactInfoCard from './ContactInfoCard';
import type {ContactItem} from './ContactInfoCard';

import callIcon from './img/call.png';
import locationIcon from './img/location.png';
import emailIcon from './img/email.png';
import personIcon from './img/person.png';

import ContactFormPanel from './ContactFormPanel';

const CONTACT_ITEMS: ContactItem[] = [
   {
      id: 'person',
      type: 'person',
      label: 'CONTACT PERSON:',
      value: 'Mir Ahasan Uddin Parvez',
      img: personIcon,
   },
   {
      id: 'email',
      type: 'email',
      label: 'EMAIL:',
      value: 'BDLPGAUTOGAS19@GMAIL.COM',
      img: emailIcon,
   },
   {
      id: 'phone',
      type: 'phone',
      label: 'CALL:',
      value: ' +8801730178288, +8801715851373',
      img: callIcon,
   },
   {
      id: 'location',
      type: 'location',
      label: 'LOCATION:',
      value: 'HOUSE - 2, ROAD - 2, PALLABI, MIRPUR, DHAKA-1216',
      img: locationIcon,
   },
];

const MAP_EMBED_URL =
   'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d233668.0639611584!2d90.25488073778608!3d23.780753035026947!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b087026b81%3A0x8fa563bbdd5904c2!2sDhaka!5e0!3m2!1sen!2sbd!4v1765343345730!5m2!1sen!2sbd';

export default function ContactUsWithForm() {
   return (
      <div className='relative w-full py-16'>
         <div className='mt-10 grid gap-6 lg:grid-cols-[440px_minmax(0,1fr)]'>
            {/* LEFT: contact cards */}
            <div className='flex flex-col gap-5'>
               {CONTACT_ITEMS.map(item => (
                  <ContactInfoCard key={item.id} item={item} />
               ))}
            </div>

            {/* RIGHT: map + form, extracted */}
            <ContactFormPanel mapUrl={MAP_EMBED_URL} />
         </div>
      </div>
   );
}

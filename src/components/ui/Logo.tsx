import Image from 'next/image';
import logo from '../../assets/logo/logo.png';

export function Logo({style}: {style?: string}) {
   return (
      <Image
         src={logo}
         alt='Association logo'
         className={`object-cover ${style ?? ''}`}
      />
   );
}

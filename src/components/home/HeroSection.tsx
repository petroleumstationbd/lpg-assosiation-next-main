'use client';

import Image from 'next/image';
import Link from 'next/link';
import bannerImg from './../../assets/bg-img/hero-bg.png';
import Header from '../../components/layout/Header';

export function HeroSection() {
   return (
      <section className='relative bg-brand-bg pb-16 '>
         <div className='page-shell'>
            <div className='relative overflow-hidden rounded-none shadow-card'>
               {/* Background image */}
               <div className='relative w-full h-[800px]'>
                  <Image
                     src={bannerImg}
                     alt='Bangladesh LPG Autogas event'
                     fill
                     priority
                     className='object-cover'
                  />

                  {/* Dark overlay for readability */}
                  <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-[#00000000] to-[#122047]' />

                  <Header />
                  {/* Content */}
                  <div className='relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white'>
                     <h1 className='max-w-3xl text-[22px] font-extrabold leading-tight sm:text-[28px] lg:text-[32px]'>
                        Bangladesh LPG Autogas Station &amp; Conversion
                        <br />
                        Workshop Owner&apos;s Association
                     </h1>

                     <p className='mt-3 text-[11px] font-semibold tracking-[0.22em] text-white/80'>
                        LICENSE NO: 21.02.0000.181.50.123.2021
                     </p>

                     <div className='mt-6'>
                        <Link
                           href='/login'
                           className='inline-flex items-center justify-center rounded-full bg-[#00A651] px-7 py-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white shadow-[0_8px_24px_rgba(0,166,81,0.55)]'>
                           Get Started
                        </Link>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
}

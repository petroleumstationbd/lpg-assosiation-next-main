'use client';

import Image from 'next/image';
import joinGradientBg from './../img/Group 97 (1).png';
import joinLineArt from './../img/Group 86.png';

export default function JoinWithUsSection() {
  return (
    <section className="relative w-full py-10 md:py-12">
      <div className="relative mx-auto w-full min-h-[320px] sm:min-h-[420px] lg:min-h-[500px] overflow-hidden">
        <Image
          src={joinGradientBg}
          alt="Join with us"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        <Image
          src={joinLineArt}
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          className="pointer-events-none object-cover mix-blend-screen opacity-60 translate-y-8 md:translate-y-11"
        />

        <div className="absolute inset-0 flex items-center justify-center text-center text-white">
          <div className="lpg-container">
            <h2 className="text-[26px] font-medium tracking-[0.05em] sm:text-[34px] lg:text-[45px]">
              JOIN WITH US
            </h2>

            <p className="mt-3 mx-auto max-w-[720px] text-[12px] sm:text-[13px] leading-relaxed text-[#EEEEEE]">
              Lorem ipsum dolor sit amet consectetur. Urna dolor amet sed ultricies quis leo.
              In urna fermentum nunc sapien tortor.
            </p>

            <div className="mt-6 inline-flex">
              <button className="neon-pill rounded-full px-7 sm:px-8 py-2 text-[11px] font-semibold tracking-[0.18em] uppercase text-white">
                GET STARTED
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

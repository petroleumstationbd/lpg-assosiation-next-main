import { motion } from 'framer-motion';
import Image from 'next/image';
import { Sponsor } from './';

export type Direction = 'left' | 'right';

type FramerMarqueeRowProps = {
  items: Sponsor[];
  direction: Direction;
  durationSec?: number;
  className?: string;
};

export default function FramerMarqueeRow({
  items,
  direction,
  durationSec = 10,
  className,
}: FramerMarqueeRowProps) {
  const repeatCount = items.length < 4 ? 4 : 2;
  const duplicated = Array.from({ length: repeatCount }, () => items).flat();
  const xKeyframes = direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'];

  return (
    <div
      className={[
        'relative pt-2 h-[65px] flex justify-center items-center mx-auto overflow-hidden',
        'max-md:pt-1 max-md:h-[56px] max-md:w-full',
        className ?? '',
      ].filter(Boolean).join(' ')}
    >
      {/* desktop-only sizer row (desktop UI same) */}
      <div className="hidden md:flex justify-center gap-4 opacity-0 pointer-events-none select-none">
        {items.map((sponsor, index) => (
          <div
            key={`sizer-${sponsor.name}-${index}`}
            className="flex h-[50px] min-w-[130px] items-center justify-center rounded-[12px] bg-white px-6"
          >
            <Image
              src={sponsor.logo}
              alt={sponsor.name}
              width={100}
              height={32}
              className="object-contain"
            />
          </div>
        ))}
      </div>

      {/* marquee track */}
      <div
        className={[
          'absolute inset-y-0 left-0 flex w-full items-center',
          'max-md:pl-4',
          'md:justify-center',
        ].join(' ')}
      >
        <motion.div
          className={[
            'flex w-max flex-nowrap items-center gap-4',
            'max-md:gap-3',
          ].join(' ')}
          style={{ willChange: 'transform' }}
          initial={{ x: xKeyframes[0] }}
          animate={{ x: xKeyframes }}
          transition={{
            duration: durationSec,
            ease: 'linear',
            repeat: Infinity,
            repeatType: 'loop',
          }}
        >
          {duplicated.map((sponsor, index) => (
            <div
              key={`${sponsor.name}-${index}`}
              className={[
                'flex items-center justify-center bg-white',
                'h-[50px] min-w-[130px] px-6 rounded-[12px]',
                'max-md:h-[42px] max-md:min-w-[110px] max-md:px-4 max-md:rounded-[10px]',
                // FIXED shadow typo (0.2)
                'shadow-[0_0px_12px_rgba(0,0,0,0.2)]',
              ].join(' ')}
            >
              <Image
                src={sponsor.logo}
                alt={sponsor.name}
                width={100}
                height={32}
                sizes="(max-width: 767px) 84px, 100px"
                className="object-contain h-[32px] w-auto max-md:h-[24px]"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

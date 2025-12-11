import type {ReactNode} from 'react';
import Image from 'next/image';
import subtrackImg from './../../assets/wrappers/Subtract.png';

type AccentCardProps = {
   children: ReactNode;
   className?: string;
   fullcard?: boolean;
};

export default function AccentCard({
   children,
   className,
   fullcard = false,
}: AccentCardProps) {
   // <article
   //   className={`relative overflow-hidden rounded-[18px] bg-white shadow-[0_18px_45px_rgba(0,0,0,0.08)] ${className ?? ''}`}
   // >
   //   {/* top accent strip + small tab */}
   //   <div className="h-[9px] w-full bg-[#6CC12A]" />
   //   <div className="absolute right-6 top-[9px] h-7 w-24 rounded-b-[18px] bg-[#E6F8D9]" />

   //   <div className="px-6 pb-7 pt-7 md:px-8 md:pb-9 md:pt-9">{children}</div>
   // </article>

   if (fullcard) {
      return (
         <article
            className={`
        relative flex  flex-col
        overflow-hidden min-h-[300px]
        rounded-[22px] ${className}`}>
            <div className='absolute -top-6 -right-6 inset-1 z-1 shadow-2xl'>
               <Image src={subtrackImg} fill alt='' />
            </div>

            {/* top-right green corner tab */}
            <div
               className='
          pointer-events-none
          absolute right-1 top-[4%]
          h-[200px] w-[80%] rounded-[40px]
          bg-[#75B551] z-0'
            />

            {/* content */}

            <div className='px-6 pb-7 pt-7 md:px-8 md:pb-9 md:pt-9 z-2'>
               {children}
            </div>
         </article>
      );
   } else {
      {
         return (
            <article
               className='
        relative flex  flex-col
        overflow-hidden min-h-[350px]
        rounded-[22px] '>
               <div className='absolute -top-6 -right-6 inset-1 z-1 shadow-2xl'>
                  <Image src={subtrackImg} fill alt='' />
               </div>

               {/* top-right green corner tab */}
               <div
                  className='
          pointer-events-none
          absolute right-6 top-[-2%]
          h-[200px] w-[60%] rounded-[40px]
          bg-[#75B551] z-0'
               />

               {/* content */}

               <div className='px-6 pb-7 pt-7 md:px-8 md:pb-9 md:pt-9 z-2'>
                  {children}
               </div>
            </article>
         );
      }
   }
}
